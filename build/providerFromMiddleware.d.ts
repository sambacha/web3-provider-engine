import { JsonRpcMiddleware } from 'json-rpc-engine';
import { SafeEventEmitterProvider, Block } from './cache-utils';
export = providerFromMiddleware;
declare function providerFromMiddleware(middleware: JsonRpcMiddleware<string[], Block>): SafeEventEmitterProvider;
