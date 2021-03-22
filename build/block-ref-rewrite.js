"use strict";
const json_rpc_engine_1 = require("json-rpc-engine");
const cache_utils_1 = require("./cache-utils");
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
const BlockTracker = require('eth-block-tracker');
function createBlockRefRewriteMiddleware({ blockTracker } = {}) {
    if (!blockTracker) {
        throw Error('BlockRefRewriteMiddleware - mandatory "blockTracker" option is missing.');
    }
    return json_rpc_engine_1.createAsyncMiddleware(async (req, _res, next) => {
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
        // rewrite blockRef to block-tracker's block number
        const latestBlockNumber = await blockTracker.getLatestBlock();
        if (req.params) {
            // eslint-disable-next-line require-atomic-updates
            req.params[blockRefIndex] = latestBlockNumber;
        }
        return next();
    });
}
module.exports = createBlockRefRewriteMiddleware;
//# sourceMappingURL=block-ref-rewrite.js.map