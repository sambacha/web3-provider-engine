import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block } from './cache-utils';
declare const BlockTracker: any;
interface BlockTrackerInspectorMiddlewareOptions {
    blockTracker: typeof BlockTracker;
}
export = createBlockTrackerInspectorMiddleware;
declare function createBlockTrackerInspectorMiddleware({ blockTracker }: BlockTrackerInspectorMiddlewareOptions): JsonRpcMiddleware<string[], Block>;
