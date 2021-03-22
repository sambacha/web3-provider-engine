import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block } from './cache-utils';
export = createInflightCache;
declare function createInflightCache(): JsonRpcMiddleware<string[], Block>;
