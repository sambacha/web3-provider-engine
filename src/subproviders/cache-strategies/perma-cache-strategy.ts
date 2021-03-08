import clone from 'clone';
import { cacheIdentifierForPayload, canCache } from '../../util/rpc-cache-utils';
import CacheStrategy from './cache-strategy';

export default class PermaCacheStrategy extends CacheStrategy {
  private cache: any;

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

  public hitCheck(payload, requestedBlockNumber, hit, miss) {
    const identifier = cacheIdentifierForPayload(payload);
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
      const clonedValue = clone(cached.result);
      return hit(null, clonedValue);
    } else {
      return miss();
    }
  }

  public cacheResult(payload, result, requestedBlockNumber, callback) {
    const identifier = cacheIdentifierForPayload(payload);
    if (result) {
      const clonedValue = clone(result);
      this.cache[identifier] = {
        blockNumber: requestedBlockNumber,
        result: clonedValue,
      };
    }
    callback();
  }

  public canCache(payload) {
    return canCache(payload);
  }
}

function compareHex(hexA, hexB) {
  const numA = parseInt(hexA, 16);
  const numB = parseInt(hexB, 16);
  return numA === numB ? 0 : numA > numB ? 1 : -1;
}
