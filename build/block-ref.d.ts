import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block, SafeEventEmitterProvider } from './cache-utils';
declare const BlockTracker: any;
interface BlockRefMiddlewareOptions {
    blockTracker?: typeof BlockTracker;
    provider?: SafeEventEmitterProvider;
}
export = createBlockRefMiddleware;
declare function createBlockRefMiddleware({ provider, blockTracker }?: BlockRefMiddlewareOptions): JsonRpcMiddleware<string[], Block>;
