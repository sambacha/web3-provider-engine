export default abstract class CacheStrategy {
    abstract canCache(payload: any): boolean;
    abstract hitCheck(payload: any, requestedBlockNumber: any, hit: any, miss: any): void;
    abstract cacheResult(payload: any, result: any, requestedBlockNumber: any, callback: any): void;
}
