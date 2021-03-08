import { JsonRpcEngineMiddlewareSubprovider as ProviderSubprovider } from './json-rpc-engine-middleware';
import createInflightCacheMiddleware from 'eth-json-rpc-middleware/inflight-cache';

export default class InflightCacheSubprovider extends ProviderSubprovider {
  constructor(opts?) {
    super(() => createInflightCacheMiddleware(opts));
  }
}
