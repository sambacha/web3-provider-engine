import { JsonRpcMiddleware } from 'json-rpc-engine';
import { Block, SafeEventEmitterProvider } from './cache-utils';
export = providerAsMiddleware;
declare function providerAsMiddleware(provider: SafeEventEmitterProvider): JsonRpcMiddleware<string[], Block>;
