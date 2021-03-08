import JsonRpcError from 'json-rpc-error';
import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';

interface Provider {
  sendAsync(payload: any, callback: (err, response) => void);
}

// wraps a provider in a subprovider interface
export default class ProviderSubprovider extends Subprovider {
  protected provider: Provider;

  constructor(provider: Provider) {
    super();
    this.provider = provider;
  }

  public handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void {
    this.provider.sendAsync(payload, (err, response) => {
      if (err) {
        return end(err);
      }
      if (response.error) {
        return end(new JsonRpcError.InternalError(response.error));
      }
      end(null, response.result);
    });
  }
}
