import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block, SafeEventEmitterProvider } from './cache-utils';
declare const BlockTracker: any;
export = createRetryOnEmptyMiddleware;
interface RetryOnEmptyMiddlewareOptions {
    provider?: SafeEventEmitterProvider;
    blockTracker?: typeof BlockTracker;
}
declare function createRetryOnEmptyMiddleware({ provider, blockTracker }?: RetryOnEmptyMiddlewareOptions): JsonRpcMiddleware<string[], Block>;
