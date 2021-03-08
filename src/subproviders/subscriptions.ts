import { JsonRpcEngineMiddlewareSubprovider as ProviderSubprovider } from './json-rpc-engine-middleware';
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager';

export default class SubscriptionsSubprovider extends ProviderSubprovider {
  constructor() {
    super(({ blockTracker, provider, engine }) => {
      const { events, middleware } = createSubscriptionManager({ blockTracker, provider });
      // forward subscription events on the engine
      events.on('notification', (data) => engine.emit('data', null, data));
      // return the subscription install/remove middleware
      return middleware;
    });
  }
}
