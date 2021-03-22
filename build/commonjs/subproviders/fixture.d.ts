import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
export default class FixtureProvider extends Subprovider {
    protected staticResponses: any;
    constructor(staticResponses: any);
    handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;
}
