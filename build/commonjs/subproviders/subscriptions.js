"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_engine_middleware_1 = require("./json-rpc-engine-middleware");
const subscriptionManager_1 = __importDefault(require("eth-json-rpc-filters/subscriptionManager"));
class SubscriptionsSubprovider extends json_rpc_engine_middleware_1.JsonRpcEngineMiddlewareSubprovider {
    constructor() {
        super(({ blockTracker, provider, engine }) => {
            const { events, middleware } = subscriptionManager_1.default({ blockTracker, provider });
            // forward subscription events on the engine
            events.on('notification', (data) => engine.emit('data', null, data));
            // return the subscription install/remove middleware
            return middleware;
        });
    }
}
exports.default = SubscriptionsSubprovider;
