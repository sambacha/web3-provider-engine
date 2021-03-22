import CacheStrategy from './cache-strategy';
export default class ConditionalPermaCacheStrategy extends CacheStrategy {
    private strategy;
    private conditionals;
    constructor(conditionals: any);
    hitCheck(payload: any, requestedBlockNumber: any, hit: any, miss: any): any;
    cacheResult(payload: any, result: any, requestedBlockNumber: any, callback: any): void;
    canCache(payload: any): any;
}
