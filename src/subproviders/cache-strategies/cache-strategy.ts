export default abstract class CacheStrategy {
  public abstract canCache(payload): boolean;
  public abstract hitCheck(payload, requestedBlockNumber, hit, miss): void;
  public abstract cacheResult(payload, result, requestedBlockNumber, callback): void;
}
