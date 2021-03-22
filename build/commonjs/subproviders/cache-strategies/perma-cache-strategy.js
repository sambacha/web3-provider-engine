"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const rpc_cache_utils_1 = require("../../util/rpc-cache-utils");
const cache_strategy_1 = __importDefault(require("./cache-strategy"));
class PermaCacheStrategy extends cache_strategy_1.default {
    constructor() {
        super();
        this.cache = {};
        // clear cache every ten minutes
        const timeout = setInterval(() => {
            this.cache = {};
        }, 10 * 60 * 1e3);
        // do not require the Node.js event loop to remain active
        if (timeout.unref) {
            timeout.unref();
        }
    }
    hitCheck(payload, requestedBlockNumber, hit, miss) {
        const identifier = rpc_cache_utils_1.cacheIdentifierForPayload(payload);
        const cached = this.cache[identifier];
        if (!cached) {
            return miss();
        }
        // If the block number we're requesting at is greater than or
        // equal to the block where we cached a previous response,
        // the cache is valid. If it's from earlier than the cache,
        // send it back down to the client (where it will be recached.)
        const cacheIsEarlyEnough = compareHex(requestedBlockNumber, cached.blockNumber) >= 0;
        if (cacheIsEarlyEnough) {
            const clonedValue = clone_1.default(cached.result);
            return hit(null, clonedValue);
        }
        else {
            return miss();
        }
    }
    cacheResult(payload, result, requestedBlockNumber, callback) {
        const identifier = rpc_cache_utils_1.cacheIdentifierForPayload(payload);
        if (result) {
            const clonedValue = clone_1.default(result);
            this.cache[identifier] = {
                blockNumber: requestedBlockNumber,
                result: clonedValue,
            };
        }
        callback();
    }
    canCache(payload) {
        return rpc_cache_utils_1.canCache(payload);
    }
}
exports.default = PermaCacheStrategy;
function compareHex(hexA, hexB) {
    const numA = parseInt(hexA, 16);
    const numB = parseInt(hexB, 16);
    return numA === numB ? 0 : numA > numB ? 1 : -1;
}
