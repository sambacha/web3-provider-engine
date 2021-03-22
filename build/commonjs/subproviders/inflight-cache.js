"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_engine_middleware_1 = require("./json-rpc-engine-middleware");
const inflight_cache_1 = __importDefault(require("eth-json-rpc-middleware/inflight-cache"));
class InflightCacheSubprovider extends json_rpc_engine_middleware_1.JsonRpcEngineMiddlewareSubprovider {
    constructor(opts) {
        super(() => inflight_cache_1.default(opts));
    }
}
exports.default = InflightCacheSubprovider;
