import { JsonRpcEngineMiddlewareSubprovider as ProviderSubprovider } from './json-rpc-engine-middleware';
import createFilterMiddleware from 'eth-json-rpc-filters';

export default class SubscriptionsSubprovider extends ProviderSubprovider {
  constructor() {
    super(({ blockTracker, provider, engine: _engine }) => {
      return createFilterMiddleware({ blockTracker, provider });
    });
  }
}
