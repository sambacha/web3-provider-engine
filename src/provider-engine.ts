import eachSeries from 'async/eachSeries';
import map from 'async/map';
import BaseProvider, { JSONRPCRequest, JSONRPCResponse, JSONRPCResponseHandler } from './base-provider';
import { ProviderEngineError, ProviderEngineErrorCode } from './errors/provider-engine-error';
import { default as Subprovider, SubproviderNextCallback } from './subprovider';
import BlockTracker, { BufferBlock } from './util/block-tracker';
import Stoplight from './util/stoplight';
import { createPayload } from './util/create-payload';

export interface ProviderEngineOptions {
  blockTracker?: any;
  blockTrackerProvider?: any;
  pollingInterval?: number;
  pollingShouldUnref?: boolean;
  disableBlockTracking?: boolean;
  debug?: boolean;
}

export default class Web3ProviderEngine extends BaseProvider {
  public currentBlock?: BufferBlock;

  protected _blockTracker: BlockTracker;
  protected _ready: Stoplight;
  protected _providers: Subprovider[];
  protected _pollForBlocks = true;
  protected _running = false;

  constructor(opts?: ProviderEngineOptions) {
    super();
    this.setMaxListeners(30);
    // parse options
    opts = opts || {};

    // block polling
    const directProvider = { sendAsync: this._handleAsync.bind(this) };

    if (opts.disableBlockTracking === true) {
      this._pollForBlocks = false;
    }

    const blockTrackerProvider = opts.blockTrackerProvider || directProvider;
    this._blockTracker = new BlockTracker({
      provider: blockTrackerProvider,
      blockTracker: opts.blockTracker,
      pollingInterval: opts.pollingInterval || 4000,
    });

    this._blockTracker.on('block', this._setCurrentBlock.bind(this));
    this._blockTracker.on('sync', this.emit.bind(this, 'sync'));
    this._blockTracker.on('rawBlock', this.emit.bind(this, 'rawBlock'));
    this._blockTracker.on('latest', this.emit.bind(this, 'latest'));

    // Handle errors instead of re-emitting, since they will throw otherwise
    this._blockTracker.on('error', (error) => {
      // Ignore errors from the block tracker unless debug is enabled
      if (opts.debug) {
        // eslint-disable-next-line no-console
        console.log('DEBUG: ' + error.message);
      }
    });

    // set initialization blocker
    this._ready = new Stoplight();
    this._providers = [];
  }

  public isRunning(): boolean {
    return this._running;
  }

  public start() {
    // trigger start
    this._ready.go();

    if (this._pollForBlocks) {
      // start tracking blocks
      this._blockTracker.start();
    }

    // update state
    this._running = true;
    // signal that we started
    this.emit('start');
  }

  public stop() {
    // stop block tracking
    this._blockTracker.stop();
    // update state
    this._running = false;
    // signal that we stopped
    this.emit('stop');
  }

  public addProvider(source: Subprovider, index?: number): void {
    if (typeof index === 'number') {
      this._providers.splice(index, 0, source);
    } else {
      this._providers.push(source);
    }
    source.setEngine(this);
  }

  public removeProvider(source: Subprovider): void {
    const index = this._providers.indexOf(source);
    if (index < 0) throw new Error('Provider not found.');
    this._providers.splice(index, 1);
  }

  public send(method: string, params: any[]): Promise<any> {
    // Wrap base class with Stoplight
    return new Promise((fulfill, reject) => {
      this._ready.await(() => {
        super.send(method, params).then(fulfill, reject);
      });
    });
  }

  public sendAsync(payload: JSONRPCRequest | JSONRPCRequest[], cb: JSONRPCResponseHandler): void {
    // Wrap base class with Stoplight
    this._ready.await(() => {
      if (Array.isArray(payload)) {
        // handle batch
        map(payload, this._handleAsync.bind(this), cb);
      } else {
        // handle single
        this._handleAsync(payload, cb);
      }
    });
  }

  // Actually perform the request
  protected sendPayload(payload: JSONRPCRequest): Promise<JSONRPCResponse> {
    return new Promise((fulfill, reject) => {
      let currentProvider = -1;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let result = null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let error = null;

      // Stack of subprovider next callbacks
      const stack: SubproviderNextCallback[] = [];

      const next = (callback?: SubproviderNextCallback) => {
        currentProvider += 1;

        if (callback) {
          // Insert in front since eachSeries traverses from front
          stack.unshift(callback);
        }

        // Bubbled down as far as we could go, and the request wasn't
        // handled. Return an error.
        if (currentProvider >= this._providers.length) {
          // tslint:disable-next-line: max-line-length
          const msg = `Request for method "${payload.method}" not handled by any subprovider.`;
          end(new ProviderEngineError(msg, ProviderEngineErrorCode.UnhandledRequest));
          return;
        }

        // Handle request in next subprovider
        try {
          const provider = this._providers[currentProvider];
          provider.handleRequest(payload, next, end);
        } catch (e) {
          end(e);
        }
      };

      const notifySubprovider = (fn: SubproviderNextCallback, callback: () => void) => {
        if (fn) {
          fn(error, result, callback);
        } else {
          callback();
        }
      };

      const end = (e: Error | null, r?: any) => {
        error = e;
        result = r;
        // Call any callbacks from subproviders
        eachSeries(stack, notifySubprovider).then(() => {
          // Reconstruct JSONRPCResponse
          const resultObj: JSONRPCResponse = {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            result,
          };
          // Complete promise
          if (error) {
            reject(error);
          } else {
            fulfill(resultObj);
          }
        });
      };

      // Call next() to kick things off
      next();
    });
  }

  protected _setCurrentBlock(bufferBlock: BufferBlock) {
    this.currentBlock = bufferBlock;
    this.emit('block', bufferBlock);
  }

  private _getBlockByNumber(blockNumber, cb) {
    const req = createPayload({ method: 'eth_getBlockByNumber', params: [blockNumber, false], skipCache: true });
    this._handleAsync(req, (err, res) => {
      if (err) return cb(err);
      return cb(null, res.result);
    });
  }

  private _handleAsync(payload: JSONRPCRequest, finished) {
    let currentProvider = -1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const error = null;

    const stack = [];

    const next = (after?: SubproviderNextCallback) => {
      currentProvider += 1;
      stack.unshift(after);

      // Bubbled down as far as we could go, and the request wasn't
      // handled. Return an error.
      if (currentProvider >= this._providers.length) {
        end(
          new Error(
            `Request for method "${payload.method}" not handled by any subprovider. Please check your subprovider configuration to ensure this method is handled.`,
          ),
        );
      } else {
        try {
          const provider = this._providers[currentProvider];
          provider.handleRequest(payload, next, end);
        } catch (e) {
          end(e);
        }
      }
    };

    const end = (error: Error | null, result?: any) => {
      eachSeries(
        stack,
        (fn, callback) => {
          if (fn) {
            fn(error, result, callback);
          } else {
            callback();
          }
        },
        () => {
          const resultObj = {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            result: result,
            error: null,
          };

          if (error != null) {
            resultObj.error = {
              message: error.stack || error.message || error,
              code: -32000,
            };
            // respond with both error formats
            finished(error, resultObj);
          } else {
            finished(null, resultObj);
          }
        },
      );
    };

    next();
  }
}
