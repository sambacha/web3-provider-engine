import { EventEmitter } from 'events';
import { JSONRPCRequest, JSONRPCResponseHandler } from '.';
import { default as Web3ProviderEngine } from './provider-engine';
import { BufferBlock } from './util/block-tracker';
import { createPayload } from './util/create-payload';

// Call this type to fallthrough to the next subprovider.
// Provide a callback to receive the result when the request is complete.
export type NextHandler = (cb?: SubproviderNextCallback) => void;

// Call this to handle the request with either an error or a result.
export type CompletionHandler = (error: Error | null, result?: any, cb?: any) => void;

// This will be called when the request is eventually handled.
// Make sure to call the provided callback when done handling the request.
export type SubproviderNextCallback = (error: Error | null, result: any, callback: () => void) => void;

// this is the base class for a subprovider -- mostly helpers
export default abstract class Subprovider extends EventEmitter {
  protected engine?: Web3ProviderEngine;
  protected currentBlock?: BufferBlock;

  public setEngine(engine: Web3ProviderEngine) {
    this.engine = engine;
    engine.on('block', (block) => (this.currentBlock = block));
    engine.on('start', () => this.start());
    engine.on('stop', () => this.stop());
  }

  // The primary method to implement
  public abstract handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void;

  public emitPayload(payload: JSONRPCRequest, cb: JSONRPCResponseHandler) {
    this.engine.sendAsync(createPayload(payload), cb);
  }

  // dummies for overriding

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public start() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public stop() {}
}
