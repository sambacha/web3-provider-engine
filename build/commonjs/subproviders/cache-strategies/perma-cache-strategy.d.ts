import CacheStrategy from './cache-strategy';
export default class PermaCacheStrategy extends CacheStrategy {
    private cache;
    constructor();
    hitCheck(payload: any, requestedBlockNumber: any, hit: any, miss: any): any;
    cacheResult(payload: any, result: any, requestedBlockNumber: any, callback: any): void;
    canCache(payload: any): boolean;
}
