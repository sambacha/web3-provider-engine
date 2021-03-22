/// <reference types="node" />
import { EventEmitter } from 'events';
import { JSONRPCRequest, JSONRPCResponseHandler } from '.';
import { default as Web3ProviderEngine } from './provider-engine';
import { BufferBlock } from './util/block-tracker';
export declare type NextHandler = (cb?: SubproviderNextCallback) => void;
export declare type CompletionHandler = (error: Error | null, result?: any, cb?: any) => void;
export declare type SubproviderNextCallback = (error: Error | null, result: any, callback: () => void) => void;
export default abstract class Subprovider extends EventEmitter {
    protected engine?: Web3ProviderEngine;
    protected currentBlock?: BufferBlock;
    setEngine(engine: Web3ProviderEngine): void;
    abstract handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;
    emitPayload(payload: JSONRPCRequest, cb: JSONRPCResponseHandler): void;
    start(): void;
    stop(): void;
}
