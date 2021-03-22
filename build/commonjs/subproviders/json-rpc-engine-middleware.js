"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcEngineMiddlewareSubprovider = void 0;
const subprovider_1 = __importDefault(require("../subprovider"));
// wraps a json-rpc-engine middleware in a subprovider interface
class JsonRpcEngineMiddlewareSubprovider extends subprovider_1.default {
    // take a constructorFn to call once we have a reference to the engine
    constructor(constructorFn) {
        super();
        this.constructorFn = constructorFn;
    }
    // this is called once the subprovider has been added to the provider engine
    setEngine(engine) {
        if (this.middleware)
            throw new Error('JsonRpcEngineMiddlewareSubprovider - subprovider added to engine twice');
        const blockTracker = engine._blockTracker;
        const middleware = this.constructorFn({ engine, provider: engine, blockTracker });
        if (!middleware)
            throw new Error('JsonRpcEngineMiddlewareSubprovider - _constructorFn did not return middleware');
        if (typeof middleware !== 'function')
            throw new Error('JsonRpcEngineMiddlewareSubprovider - specified middleware is not a function');
        this.middleware = middleware;
    }
    handleRequest(req, next, end) {
        const res = { id: req.id, jsonrpc: '2.0' };
        this.middleware(req, res, middlewareNext, middlewareEnd);
        function middlewareNext(handler) {
            next((err, result, cb) => {
                // update response object with result or error
                if (err) {
                    delete res.result;
                    res.error = { message: err.message, code: null };
                }
                else {
                    res.result = result;
                }
                // call middleware's next handler (even if error)
                if (handler) {
                    handler(cb);
                }
                else {
                    cb();
                }
            });
        }
        function middlewareEnd(err) {
            if (err) {
                end(new Error(err.message));
            }
            else {
                end(null, res.result);
            }
        }
    }
}
exports.JsonRpcEngineMiddlewareSubprovider = JsonRpcEngineMiddlewareSubprovider;
