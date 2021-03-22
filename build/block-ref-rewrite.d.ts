import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block } from './cache-utils';
declare const BlockTracker: any;
interface BlockRefRewriteMiddlewareOptions {
    blockTracker?: typeof BlockTracker;
}
export = createBlockRefRewriteMiddleware;
declare function createBlockRefRewriteMiddleware({ blockTracker }?: BlockRefRewriteMiddlewareOptions): JsonRpcMiddleware<string[], Block>;
