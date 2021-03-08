import { JsonRpcEngineMiddlewareSubprovider as ProviderSubprovider } from './json-rpc-engine-middleware';
import createBlockCacheMiddleware from 'eth-json-rpc-middleware/block-cache';

export default class BlockCacheSubprovider extends ProviderSubprovider {
  constructor(opts?) {
    super(({ blockTracker }) => createBlockCacheMiddleware(Object.assign({ blockTracker }, opts)));
  }
}
