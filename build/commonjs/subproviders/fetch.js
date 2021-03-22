"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncify_1 = __importDefault(require("async/asyncify"));
const retry_1 = __importDefault(require("async/retry"));
const waterfall_1 = __importDefault(require("async/waterfall"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const json_rpc_error_1 = __importDefault(require("json-rpc-error"));
const promise_to_callback_1 = __importDefault(require("promise-to-callback"));
const subprovider_1 = __importDefault(require("../subprovider"));
const create_payload_1 = require("../util/create-payload");
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
class FetchSubprovider extends subprovider_1.default {
    constructor(opts) {
        super();
        this.rpcUrl = opts.rpcUrl;
        this.originHttpHeaderKey = opts.originHttpHeaderKey;
    }
    handleRequest(payload, next, end) {
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
        retry_1.default({
            times: 5,
            interval: 1000,
            errorFilter: isErrorRetriable,
        }, (cb) => this._submitRequest(reqParams, cb), (err, result) => {
            // ends on retriable error
            if (err && isErrorRetriable(err)) {
                const errMsg = `FetchSubprovider - cannot complete request. All retries exhausted.\nOriginal Error:\n${err.toString()}\n\n`;
                const retriesExhaustedErr = new Error(errMsg);
                return end(retriesExhaustedErr);
            }
            // otherwise continue normally
            return end(err, result);
        });
    }
    createPayload(payload) {
        return create_payload_1.createPayload(payload);
    }
    _submitRequest(reqParams, done) {
        const targetUrl = this.rpcUrl;
        promise_to_callback_1.default(cross_fetch_1.default(targetUrl, reqParams))((err, res) => {
            if (err) {
                return done(err);
            }
            // continue parsing result
            waterfall_1.default([
                checkForHttpErrors,
                // buffer body
                (cb) => promise_to_callback_1.default(res.text())(cb),
                // parse body
                asyncify_1.default((rawBody) => JSON.parse(rawBody)),
                parseResponse,
            ], done);
            function checkForHttpErrors(cb) {
                // check for errors
                switch (res.status) {
                    case 405:
                        return cb(new json_rpc_error_1.default.MethodNotFound());
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
                    return cb(new json_rpc_error_1.default.InternalError(body));
                }
                // check for rpc error
                if (body.error) {
                    return cb(new json_rpc_error_1.default.InternalError(body.error));
                }
                // return successful result
                cb(null, body.result);
            }
        });
    }
}
exports.default = FetchSubprovider;
function isErrorRetriable(err) {
    const errMsg = err.toString();
    return RETRIABLE_ERRORS.some((phrase) => errMsg.includes(phrase));
}
function createRatelimitError() {
    const msg = 'Request is being rate limited.';
    const err = new Error(msg);
    return new json_rpc_error_1.default.InternalError(err);
}
function createTimeoutError() {
    let msg = 'Gateway timeout. The request took too long to process. ';
    msg += 'This can happen when querying logs over too wide a block range.';
    const err = new Error(msg);
    return new json_rpc_error_1.default.InternalError(err);
}
