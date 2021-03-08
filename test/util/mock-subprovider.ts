import Subprovider from '../../src/subproviders/subprovider';

export default class MockSubprovider extends Subprovider {

  private _handleRequest?: (payload, next, end) => void;

  constructor(handleRequest?: (payload, next, end) => void) {
    super();
    this._handleRequest = handleRequest;
  }

  public handleRequest(payload, next, end) {
    if (this._handleRequest) {
      this._handleRequest(payload, next, end);
      return;
    }

    const mockResponse = {
      data: 'mock-success!',
    };

    end(mockResponse);
  }
}
