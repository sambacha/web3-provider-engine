import CacheStrategy from './cache-strategy';
import PermaCacheStrategy from './perma-cache-strategy';

//
// ConditionalPermaCacheStrategy
//

export default class ConditionalPermaCacheStrategy extends CacheStrategy {
  private strategy: any;
  private conditionals: any;

  constructor(conditionals) {
    super();
    this.strategy = new PermaCacheStrategy();
    this.conditionals = conditionals;
  }

  public hitCheck(payload, requestedBlockNumber, hit, miss) {
    return this.strategy.hitCheck(payload, requestedBlockNumber, hit, miss);
  }

  public cacheResult(payload, result, requestedBlockNumber, callback) {
    const conditional = this.conditionals[payload.method];

    if (conditional) {
      if (conditional(result)) {
        this.strategy.cacheResult(payload, result, requestedBlockNumber, callback);
      } else {
        callback();
      }
    } else {
      // Cache all requests that don't have a conditional
      this.strategy.cacheResult(payload, result, requestedBlockNumber, callback);
    }
  }

  public canCache(payload) {
    return this.strategy.canCache(payload);
  }
}
