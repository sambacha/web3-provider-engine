import { JSONRPCRequest } from '../base-provider';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
export interface GaspriceProviderOptions {
    numberOfBlocks?: number;
    delayInBlocks?: number;
}
export default class GaspriceProvider extends Subprovider {
    numberOfBlocks: number;
    delayInBlocks: number;
    constructor(opts?: GaspriceProviderOptions);
    handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;
}
