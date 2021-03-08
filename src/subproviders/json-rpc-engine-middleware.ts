import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';
import { default as Web3ProviderEngine } from '../provider-engine';
import { JsonRpcMiddleware, JsonRpcResponse, JsonRpcRequest, JsonRpcError } from 'json-rpc-engine';
import { JSONRPCRequest } from '../base-provider';

export type ConstructorFn = ({
  engine: JsonRpcEngine,
  provider: Provider,
  blockTracker: BlockTracker,
}) => JsonRpcMiddleware;

// wraps a json-rpc-engine middleware in a subprovider interface
export class JsonRpcEngineMiddlewareSubprovider extends Subprovider {
  private middleware: JsonRpcMiddleware;
  private constructorFn: ConstructorFn;

  // take a constructorFn to call once we have a reference to the engine
  constructor(constructorFn: ConstructorFn) {
    super();
    this.constructorFn = constructorFn;
  }

  // this is called once the subprovider has been added to the provider engine
  public setEngine(engine: Web3ProviderEngine): void {
    if (this.middleware) throw new Error('JsonRpcEngineMiddlewareSubprovider - subprovider added to engine twice');

    const blockTracker = (engine as any)._blockTracker;
    const middleware = this.constructorFn({ engine, provider: engine, blockTracker });
    if (!middleware) throw new Error('JsonRpcEngineMiddlewareSubprovider - _constructorFn did not return middleware');
    if (typeof middleware !== 'function')
      throw new Error('JsonRpcEngineMiddlewareSubprovider - specified middleware is not a function');
    this.middleware = middleware;
  }

  public handleRequest(req: JSONRPCRequest, next: NextHandler, end: CompletionHandler) {
    const res: JsonRpcResponse<any> = { id: req.id, jsonrpc: '2.0' };
    this.middleware(req as JsonRpcRequest<any>, res, middlewareNext, middlewareEnd);

    function middlewareNext(handler?: (done: () => void) => void): void {
      next((err: Error | null, result?: any, cb?: any): void => {
        // update response object with result or error
        if (err) {
          delete res.result;
          res.error = { message: err.message, code: null };
        } else {
          res.result = result;
        }
        // call middleware's next handler (even if error)
        if (handler) {
          handler(cb);
        } else {
          cb();
        }
      });
    }

    function middlewareEnd(err?: JsonRpcError<any>): void {
      if (err) {
        end(new Error(err.message));
      } else {
        end(null, res.result);
      }
    }
  }
}
