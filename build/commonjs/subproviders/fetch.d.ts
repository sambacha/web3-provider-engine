import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
export interface FetchSubproviderOptions {
    rpcUrl: string;
    originHttpHeaderKey?: string;
}
export default class FetchSubprovider extends Subprovider {
    protected rpcUrl: string;
    protected originHttpHeaderKey?: string;
    constructor(opts: FetchSubproviderOptions);
    handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;
    protected createPayload(payload: any): JSONRPCRequest;
    protected _submitRequest(reqParams: any, done: any): void;
}
