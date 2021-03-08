import FixtureProvider from '../../src/subproviders/fixture';

export default class PassthroughProvider extends FixtureProvider {
  constructor() {
    // Intentionally passes no fixtures
    super({});
  }
}
