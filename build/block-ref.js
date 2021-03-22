"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const json_rpc_engine_1 = require("json-rpc-engine");
const clone_1 = __importDefault(require("clone"));
const pify_1 = __importDefault(require("pify"));
const cache_utils_1 = require("./cache-utils");
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
const BlockTracker = require('eth-block-tracker');
function createBlockRefMiddleware({ provider, blockTracker } = {}) {
    if (!provider) {
        throw Error('BlockRefMiddleware - mandatory "provider" option is missing.');
    }
    if (!blockTracker) {
        throw Error('BlockRefMiddleware - mandatory "blockTracker" option is missing.');
    }
    return json_rpc_engine_1.createAsyncMiddleware(async (req, res, next) => {
        var _a;
        const blockRefIndex = cache_utils_1.blockTagParamIndex(req);
        // skip if method does not include blockRef
        if (blockRefIndex === undefined) {
            return next();
        }
        // skip if not "latest"
        let blockRef = (_a = req.params) === null || _a === void 0 ? void 0 : _a[blockRefIndex];
        // omitted blockRef implies "latest"
        if (blockRef === undefined) {
            blockRef = 'latest';
        }
        if (blockRef !== 'latest') {
            return next();
        }
        // lookup latest block
        const latestBlockNumber = await blockTracker.getLatestBlock();
        // create child request with specific block-ref
        const childRequest = clone_1.default(req);
        if (childRequest.params) {
            childRequest.params[blockRefIndex] = latestBlockNumber;
        }
        // perform child request
        const childRes = await pify_1.default(provider.sendAsync).call(provider, childRequest);
        // copy child response onto original response
        res.result = childRes.result;
        res.error = childRes.error;
        return next();
    });
}
module.exports = createBlockRefMiddleware;
//# sourceMappingURL=block-ref.js.map