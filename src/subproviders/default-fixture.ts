import extend from 'xtend';
import FixtureProvider from './fixture';

export default class DefaultFixtures extends FixtureProvider {
  constructor(opts?) {
    opts = opts || {};
    const responses = extend({
      web3_clientVersion: 'ProviderEngine' + '/javascript',
      net_listening: true,
      eth_hashrate: '0x00',
      eth_mining: false,
    }, opts);
    super(responses);
  }
}
