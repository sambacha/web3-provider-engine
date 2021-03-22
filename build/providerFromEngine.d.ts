import { JsonRpcEngine } from 'json-rpc-engine';
import { SafeEventEmitterProvider } from './cache-utils';
export = providerFromEngine;
declare function providerFromEngine(engine: JsonRpcEngine): SafeEventEmitterProvider;
