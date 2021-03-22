"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_engine_middleware_1 = require("./json-rpc-engine-middleware");
const eth_json_rpc_filters_1 = __importDefault(require("eth-json-rpc-filters"));
class SubscriptionsSubprovider extends json_rpc_engine_middleware_1.JsonRpcEngineMiddlewareSubprovider {
    constructor() {
        super(({ blockTracker, provider, engine: _engine }) => {
            return eth_json_rpc_filters_1.default({ blockTracker, provider });
        });
    }
}
exports.default = SubscriptionsSubprovider;
