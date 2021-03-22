import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
interface Provider {
    sendAsync(payload: any, callback: (err: any, response: any) => void): any;
}
export default class ProviderSubprovider extends Subprovider {
    protected provider: Provider;
    constructor(provider: Provider);
    handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;
}
export {};
