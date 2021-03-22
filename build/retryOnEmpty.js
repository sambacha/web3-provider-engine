"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const json_rpc_engine_1 = require("json-rpc-engine");
const clone_1 = __importDefault(require("clone"));
const pify_1 = __importDefault(require("pify"));
const cache_utils_1 = require("./cache-utils");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const BlockTracker = require('eth-block-tracker');
// empty values used to determine if a request should be retried
// `<nil>` comes from https://github.com/ethereum/go-ethereum/issues/16925
const emptyValues = [undefined, null, '\u003cnil\u003e'];
function createRetryOnEmptyMiddleware({ provider, blockTracker } = {}) {
    if (!provider) {
        throw Error('RetryOnEmptyMiddleware - mandatory "provider" option is missing.');
    }
    if (!blockTracker) {
        throw Error('RetryOnEmptyMiddleware - mandatory "blockTracker" option is missing.');
    }
    return json_rpc_engine_1.createAsyncMiddleware(async (req, res, next) => {
        var _a;
        const blockRefIndex = cache_utils_1.blockTagParamIndex(req);
        // skip if method does not include blockRef
        if (blockRefIndex === undefined) {
            return next();
        }
        // skip if not exact block references
        let blockRef = (_a = req.params) === null || _a === void 0 ? void 0 : _a[blockRefIndex];
        // omitted blockRef implies "latest"
        if (blockRef === undefined) {
            blockRef = 'latest';
        }
        // skip if non-number block reference
        if (['latest', 'pending'].includes(blockRef)) {
            return next();
        }
        // skip if block refernce is not a valid number
        const blockRefNumber = Number.parseInt(blockRef.slice(2), 16);
        if (Number.isNaN(blockRefNumber)) {
            return next();
        }
        // lookup latest block
        const latestBlockNumberHex = await blockTracker.getLatestBlock();
        const latestBlockNumber = Number.parseInt(latestBlockNumberHex.slice(2), 16);
        // skip if request block number is higher than current
        if (blockRefNumber > latestBlockNumber) {
            return next();
        }
        // create child request with specific block-ref
        const childRequest = clone_1.default(req);
        // attempt child request until non-empty response is received
        const childResponse = await retry(10, async () => {
            const attemptResponse = await pify_1.default(provider.sendAsync).call(provider, childRequest);
            // verify result
            if (emptyValues.includes(attemptResponse)) {
                throw new Error(`RetryOnEmptyMiddleware - empty response "${JSON.stringify(attemptResponse)}" for request "${JSON.stringify(childRequest)}"`);
            }
            return attemptResponse;
        });
        // copy child response onto original response
        res.result = childResponse.result;
        res.error = childResponse.error;
        return next();
    });
}
async function retry(maxRetries, asyncFn) {
    for (let index = 0; index < maxRetries; index++) {
        try {
            return await asyncFn();
        }
        catch (err) {
            await timeout(1000);
        }
    }
    throw new Error('RetryOnEmptyMiddleware - retries exhausted');
}
function timeout(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
module.exports = createRetryOnEmptyMiddleware;
//# sourceMappingURL=retryOnEmpty.js.map