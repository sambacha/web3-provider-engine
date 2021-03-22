"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const json_rpc_engine_1 = require("json-rpc-engine");
const providerFromEngine_1 = __importDefault(require("./providerFromEngine"));
function providerFromMiddleware(middleware) {
    const engine = new json_rpc_engine_1.JsonRpcEngine();
    engine.push(middleware);
    const provider = providerFromEngine_1.default(engine);
    return provider;
}
module.exports = providerFromMiddleware;
//# sourceMappingURL=providerFromMiddleware.js.map