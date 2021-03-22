"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_engine_middleware_1 = require("./json-rpc-engine-middleware");
const block_cache_1 = __importDefault(require("eth-json-rpc-middleware/block-cache"));
class BlockCacheSubprovider extends json_rpc_engine_middleware_1.JsonRpcEngineMiddlewareSubprovider {
    constructor(opts) {
        super(({ blockTracker }) => block_cache_1.default(Object.assign({ blockTracker }, opts)));
    }
}
exports.default = BlockCacheSubprovider;
