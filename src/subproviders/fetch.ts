import asyncify from 'async/asyncify';
import retry from 'async/retry';
import waterfall from 'async/waterfall';
import fetch from 'cross-fetch';
import JsonRpcError from 'json-rpc-error';
import promiseToCallback from 'promise-to-callback';
import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
import { createPayload } from '../util/create-payload';

const RETRIABLE_ERRORS = [
  // ignore server overload errors
  'Gateway timeout',
  'ETIMEDOUT',
  // ignore server sent html error pages
  // or truncated json responses
  'SyntaxError',
  'failed to parse response body',
  // ignore errors where http req failed to establish
  'Failed to fetch',
];

export interface FetchSubproviderOptions {
  rpcUrl: string;
  originHttpHeaderKey?: string;
}

export default class FetchSubprovider extends Subprovider {

  protected rpcUrl: string;
  protected originHttpHeaderKey?: string;

  constructor(opts: FetchSubproviderOptions) {
    super();
    this.rpcUrl = opts.rpcUrl;
    this.originHttpHeaderKey = opts.originHttpHeaderKey;
  }

  public handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void {
    const originDomain = payload.origin;

    // overwrite id to not conflict with other concurrent users
    const newPayload = this.createPayload(payload);
    // remove extra parameter from request
    delete newPayload.origin;

    const reqParams = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPayload),
    };

    if (this.originHttpHeaderKey && originDomain) {
      reqParams.headers[this.originHttpHeaderKey] = originDomain;
    }

    retry({
      times: 5,
      interval: 1000,
      errorFilter: isErrorRetriable,
    },
    (cb) => this._submitRequest(reqParams, cb),
    (err, result) => {
      // ends on retriable error
      if (err && isErrorRetriable(err)) {
        const errMsg =
          `FetchSubprovider - cannot complete request. All retries exhausted.\nOriginal Error:\n${err.toString()}\n\n`;
        const retriesExhaustedErr = new Error(errMsg);
        return end(retriesExhaustedErr);
      }
      // otherwise continue normally
      return end(err, result);
    });
  }

  protected createPayload(payload): JSONRPCRequest {
    return createPayload(payload);
  }

  protected _submitRequest(reqParams, done) {
    const targetUrl = this.rpcUrl;

    promiseToCallback(fetch(targetUrl, reqParams))((err, res) => {
      if (err) { return done(err); }

      // continue parsing result
      waterfall([
        checkForHttpErrors,
        // buffer body
        (cb) => promiseToCallback(res.text())(cb),
        // parse body
        asyncify((rawBody) => JSON.parse(rawBody)),
        parseResponse,
      ], done);

      function checkForHttpErrors(cb) {
        // check for errors
        switch (res.status) {
          case 405:
            return cb(new JsonRpcError.MethodNotFound());

          case 418:
            return cb(createRatelimitError());

          case 503:
          case 504:
            return cb(createTimeoutError());

          default:
            return cb();
        }
      }

      function parseResponse(body, cb) {
        // check for error code
        if (res.status !== 200) {
          return cb(new JsonRpcError.InternalError(body));
        }
        // check for rpc error
        if (body.error) { return cb(new JsonRpcError.InternalError(body.error)); }
        // return successful result
        cb(null, body.result);
      }
    });
  }

}

function isErrorRetriable(err) {
  const errMsg = err.toString();
  return RETRIABLE_ERRORS.some((phrase) => errMsg.includes(phrase));
}

function createRatelimitError() {
  const msg = 'Request is being rate limited.';
  const err = new Error(msg);
  return new JsonRpcError.InternalError(err);
}

function createTimeoutError() {
  let msg = 'Gateway timeout. The request took too long to process. ';
  msg += 'This can happen when querying logs over too wide a block range.';
  const err = new Error(msg);
  return new JsonRpcError.InternalError(err);
}
