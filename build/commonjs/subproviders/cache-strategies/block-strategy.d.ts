import CacheStrategy from './cache-strategy';
export default class BlockCacheStrategy extends CacheStrategy {
    private cache;
    constructor();
    getBlockCacheForPayload(payload: any, blockNumberHex: any): any;
    hitCheck(payload: any, requestedBlockNumber: any, hit: any, miss: any): any;
    cacheResult(payload: any, result: any, requestedBlockNumber: any, callback: any): void;
    canCache(payload: any): boolean;
    cacheRollOff(previousBlock: any): void;
}
