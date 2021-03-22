"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const eth_util_1 = require("../../util/eth-util");
const rpc_cache_utils_1 = require("../../util/rpc-cache-utils");
const cache_strategy_1 = __importDefault(require("./cache-strategy"));
//
// BlockCacheStrategy
//
class BlockCacheStrategy extends cache_strategy_1.default {
    constructor() {
        super();
        this.cache = {};
    }
    getBlockCacheForPayload(payload, blockNumberHex) {
        const blockNumber = parseInt(blockNumberHex, 16);
        let blockCache = this.cache[blockNumber];
        // create new cache if necesary
        if (!blockCache) {
            const newCache = {};
            this.cache[blockNumber] = newCache;
            blockCache = newCache;
        }
        return blockCache;
    }
    hitCheck(payload, requestedBlockNumber, hit, miss) {
        const blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber);
        if (!blockCache) {
            return miss();
        }
        const identifier = rpc_cache_utils_1.cacheIdentifierForPayload(payload);
        const cached = blockCache[identifier];
        if (cached) {
            const clonedValue = clone_1.default(cached);
            return hit(null, clonedValue);
        }
        else {
            return miss();
        }
    }
    cacheResult(payload, result, requestedBlockNumber, callback) {
        if (result) {
            const blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber);
            const identifier = rpc_cache_utils_1.cacheIdentifierForPayload(payload);
            const clonedValue = clone_1.default(result);
            blockCache[identifier] = clonedValue;
        }
        callback();
    }
    canCache(payload) {
        if (!rpc_cache_utils_1.canCache(payload)) {
            return false;
        }
        const blockTag = rpc_cache_utils_1.blockTagForPayload(payload);
        return blockTag !== 'pending';
    }
    // naively removes older block caches
    cacheRollOff(previousBlock) {
        const previousHex = eth_util_1.bufferToHex(previousBlock.number);
        const oldBlockNumber = parseInt(previousHex, 16);
        // clear old caches
        Object.keys(this.cache)
            .map(Number)
            .filter((num) => num <= oldBlockNumber)
            .forEach((num) => delete this.cache[num]);
    }
}
exports.default = BlockCacheStrategy;
