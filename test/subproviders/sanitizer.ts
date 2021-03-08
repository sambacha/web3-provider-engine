import test = require('tape');
import ProviderEngine from '../../src/index';
import FixtureProvider from '../../src/subproviders/fixture';
import SanitizerSubprovider from '../../src/subproviders/sanitizer';
import TestBlockProvider from '../util/block';

test('Sanitizer removes unknown keys', (t) => {
  t.plan(8);

  const engine = new ProviderEngine();

  const sanitizer = new SanitizerSubprovider();
  engine.addProvider(sanitizer);

  // test sanitization
  const checkSanitizer = new FixtureProvider({
    test_unsanitized: (req, next, end) => {
      if (req.method !== 'test_unsanitized') { return next(); }
      const firstParam = payload.params[0];
      t.notOk(firstParam && firstParam.foo);
      t.equal(firstParam.gas, '0x01');
      t.equal(firstParam.data, '0x01');
      t.equal(firstParam.fromBlock, 'latest');
      t.equal(firstParam.topics.length, 3);
      t.equal(firstParam.topics[1], '0x0a');
      end(null, { baz: 'bam' });
    },
  });
  engine.addProvider(checkSanitizer);

  // handle block requests
  const blockProvider = new TestBlockProvider();
  engine.addProvider(blockProvider);

  engine.start();

  const payload = {
    method: 'test_unsanitized',
    params: [{
      foo: 'bar',
      gas: '0x01',
      data: '01',
      fromBlock: 'latest',
      topics: [
        null,
        '0X0A',
        '0x03',
      ],
    }],
  };

  engine.sendAsync(payload, (err, response) => {
    engine.stop();
    t.notOk(err, 'no error');
    t.equal(response.result.baz, 'bam', 'result was received correctly');
    t.end();
  });
});
