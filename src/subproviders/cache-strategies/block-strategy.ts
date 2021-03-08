import clone from 'clone';
import { bufferToHex } from '../../util/eth-util';
import { blockTagForPayload, cacheIdentifierForPayload, canCache } from '../../util/rpc-cache-utils';
import CacheStrategy from './cache-strategy';

//
// BlockCacheStrategy
//

export default class BlockCacheStrategy extends CacheStrategy {
  private cache: any;

  constructor() {
    super();
    this.cache = {};
  }

  public getBlockCacheForPayload(payload, blockNumberHex) {
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

  public hitCheck(payload, requestedBlockNumber, hit, miss) {
    const blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber);

    if (!blockCache) {
      return miss();
    }

    const identifier = cacheIdentifierForPayload(payload);
    const cached = blockCache[identifier];
    if (cached) {
      const clonedValue = clone(cached);
      return hit(null, clonedValue);
    } else {
      return miss();
    }
  }

  public cacheResult(payload, result, requestedBlockNumber, callback) {
    if (result) {
      const blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber);
      const identifier = cacheIdentifierForPayload(payload);
      const clonedValue = clone(result);
      blockCache[identifier] = clonedValue;
    }
    callback();
  }

  public canCache(payload) {
    if (!canCache(payload)) {
      return false;
    }
    const blockTag = blockTagForPayload(payload);
    return blockTag !== 'pending';
  }

  // naively removes older block caches
  public cacheRollOff(previousBlock) {
    const previousHex = bufferToHex(previousBlock.number);
    const oldBlockNumber = parseInt(previousHex, 16);
    // clear old caches
    Object.keys(this.cache)
      .map(Number)
      .filter((num) => num <= oldBlockNumber)
      .forEach((num) => delete this.cache[num]);
  }
}
