"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_strategy_1 = __importDefault(require("./cache-strategy"));
const perma_cache_strategy_1 = __importDefault(require("./perma-cache-strategy"));
//
// ConditionalPermaCacheStrategy
//
class ConditionalPermaCacheStrategy extends cache_strategy_1.default {
    constructor(conditionals) {
        super();
        this.strategy = new perma_cache_strategy_1.default();
        this.conditionals = conditionals;
    }
    hitCheck(payload, requestedBlockNumber, hit, miss) {
        return this.strategy.hitCheck(payload, requestedBlockNumber, hit, miss);
    }
    cacheResult(payload, result, requestedBlockNumber, callback) {
        const conditional = this.conditionals[payload.method];
        if (conditional) {
            if (conditional(result)) {
                this.strategy.cacheResult(payload, result, requestedBlockNumber, callback);
            }
            else {
                callback();
            }
        }
        else {
            // Cache all requests that don't have a conditional
            this.strategy.cacheResult(payload, result, requestedBlockNumber, callback);
        }
    }
    canCache(payload) {
        return this.strategy.canCache(payload);
    }
}
exports.default = ConditionalPermaCacheStrategy;
