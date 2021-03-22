"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eachSeries_1 = __importDefault(require("async/eachSeries"));
const map_1 = __importDefault(require("async/map"));
const base_provider_1 = __importDefault(require("./base-provider"));
const provider_engine_error_1 = require("./errors/provider-engine-error");
const block_tracker_1 = __importDefault(require("./util/block-tracker"));
const stoplight_1 = __importDefault(require("./util/stoplight"));
const create_payload_1 = require("./util/create-payload");
class Web3ProviderEngine extends base_provider_1.default {
    constructor(opts) {
        super();
        this._pollForBlocks = true;
        this._running = false;
        this.setMaxListeners(30);
        // parse options
        opts = opts || {};
        // block polling
        const directProvider = { sendAsync: this._handleAsync.bind(this) };
        if (opts.disableBlockTracking === true) {
            this._pollForBlocks = false;
        }
        const blockTrackerProvider = opts.blockTrackerProvider || directProvider;
        this._blockTracker = new block_tracker_1.default({
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
        this._ready = new stoplight_1.default();
        this._providers = [];
    }
    isRunning() {
        return this._running;
    }
    start() {
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
    stop() {
        // stop block tracking
        this._blockTracker.stop();
        // update state
        this._running = false;
        // signal that we stopped
        this.emit('stop');
    }
    addProvider(source, index) {
        if (typeof index === 'number') {
            this._providers.splice(index, 0, source);
        }
        else {
            this._providers.push(source);
        }
        source.setEngine(this);
    }
    removeProvider(source) {
        const index = this._providers.indexOf(source);
        if (index < 0)
            throw new Error('Provider not found.');
        this._providers.splice(index, 1);
    }
    send(method, params) {
        // Wrap base class with Stoplight
        return new Promise((fulfill, reject) => {
            this._ready.await(() => {
                super.send(method, params).then(fulfill, reject);
            });
        });
    }
    sendAsync(payload, cb) {
        // Wrap base class with Stoplight
        this._ready.await(() => {
            if (Array.isArray(payload)) {
                // handle batch
                map_1.default(payload, this._handleAsync.bind(this), cb);
            }
            else {
                // handle single
                this._handleAsync(payload, cb);
            }
        });
    }
    // Actually perform the request
    sendPayload(payload) {
        return new Promise((fulfill, reject) => {
            let currentProvider = -1;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let result = null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let error = null;
            // Stack of subprovider next callbacks
            const stack = [];
            const next = (callback) => {
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
                    end(new provider_engine_error_1.ProviderEngineError(msg, provider_engine_error_1.ProviderEngineErrorCode.UnhandledRequest));
                    return;
                }
                // Handle request in next subprovider
                try {
                    const provider = this._providers[currentProvider];
                    provider.handleRequest(payload, next, end);
                }
                catch (e) {
                    end(e);
                }
            };
            const notifySubprovider = (fn, callback) => {
                if (fn) {
                    fn(error, result, callback);
                }
                else {
                    callback();
                }
            };
            const end = (e, r) => {
                error = e;
                result = r;
                // Call any callbacks from subproviders
                eachSeries_1.default(stack, notifySubprovider).then(() => {
                    // Reconstruct JSONRPCResponse
                    const resultObj = {
                        id: payload.id,
                        jsonrpc: payload.jsonrpc,
                        result,
                    };
                    // Complete promise
                    if (error) {
                        reject(error);
                    }
                    else {
                        fulfill(resultObj);
                    }
                });
            };
            // Call next() to kick things off
            next();
        });
    }
    _setCurrentBlock(bufferBlock) {
        this.currentBlock = bufferBlock;
        this.emit('block', bufferBlock);
    }
    _getBlockByNumber(blockNumber, cb) {
        const req = create_payload_1.createPayload({ method: 'eth_getBlockByNumber', params: [blockNumber, false], skipCache: true });
        this._handleAsync(req, (err, res) => {
            if (err)
                return cb(err);
            return cb(null, res.result);
        });
    }
    _handleAsync(payload, finished) {
        let currentProvider = -1;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const error = null;
        const stack = [];
        const next = (after) => {
            currentProvider += 1;
            stack.unshift(after);
            // Bubbled down as far as we could go, and the request wasn't
            // handled. Return an error.
            if (currentProvider >= this._providers.length) {
                end(new Error(`Request for method "${payload.method}" not handled by any subprovider. Please check your subprovider configuration to ensure this method is handled.`));
            }
            else {
                try {
                    const provider = this._providers[currentProvider];
                    provider.handleRequest(payload, next, end);
                }
                catch (e) {
                    end(e);
                }
            }
        };
        const end = (error, result) => {
            eachSeries_1.default(stack, (fn, callback) => {
                if (fn) {
                    fn(error, result, callback);
                }
                else {
                    callback();
                }
            }, () => {
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
                }
                else {
                    finished(null, resultObj);
                }
            });
        };
        next();
    }
}
exports.default = Web3ProviderEngine;
