import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block } from './cache-utils';
declare const BlockTracker: any;
interface BlockCacheMiddlewareOptions {
    blockTracker?: typeof BlockTracker;
}
export = createBlockCacheMiddleware;
declare function createBlockCacheMiddleware({ blockTracker }?: BlockCacheMiddlewareOptions): JsonRpcMiddleware<string[], Block>;
