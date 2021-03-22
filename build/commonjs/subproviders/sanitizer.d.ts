import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
export default class SanitizerSubprovider extends Subprovider {
    handleRequest(payload: JSONRPCRequest, next: NextHandler, _end: CompletionHandler): void;
}
