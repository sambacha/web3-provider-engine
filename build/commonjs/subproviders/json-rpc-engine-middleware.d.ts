import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
import { default as Web3ProviderEngine } from '../provider-engine';
import { JsonRpcMiddleware } from 'json-rpc-engine';
import { JSONRPCRequest } from '../base-provider';
export declare type ConstructorFn = ({ engine: JsonRpcEngine, provider: Provider, blockTracker: BlockTracker, }: {
    engine: any;
    provider: any;
    blockTracker: any;
}) => JsonRpcMiddleware;
export declare class JsonRpcEngineMiddlewareSubprovider extends Subprovider {
    private middleware;
    private constructorFn;
    constructor(constructorFn: ConstructorFn);
    setEngine(engine: Web3ProviderEngine): void;
    handleRequest(req: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;
}
