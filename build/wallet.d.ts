import { JsonRpcMiddleware, JsonRpcRequest } from 'json-rpc-engine';
import { Block } from './cache-utils';
declare type ParamsObject = Record<string, unknown>;
interface WalletMiddlewareOptions {
    getAccounts: (req: JsonRpcRequest<unknown>) => Promise<string[]>;
    processDecryptMessage?: (msgParams: ParamsObject, req: JsonRpcRequest<unknown>) => Promise<ParamsObject>;
    processEncryptionPublicKey?: (address: string, req: JsonRpcRequest<unknown>) => Promise<ParamsObject>;
    processEthSignMessage?: (msgParams: ParamsObject, req: JsonRpcRequest<unknown>) => Promise<ParamsObject>;
    processPersonalMessage?: (msgParams: ParamsObject, req: JsonRpcRequest<unknown>) => Promise<ParamsObject>;
    processTransaction?: (txParams: ParamsObject, req: JsonRpcRequest<unknown>) => Promise<ParamsObject>;
    processTypedMessage?: (msgParams: ParamsObject, req: JsonRpcRequest<unknown>, version: string) => Promise<ParamsObject>;
    processTypedMessageV3?: (msgParams: ParamsObject, req: JsonRpcRequest<unknown>, version: string) => Promise<ParamsObject>;
    processTypedMessageV4?: (msgParams: ParamsObject, req: JsonRpcRequest<unknown>, version: string) => Promise<ParamsObject>;
}
export = createWalletMiddleware;
declare function createWalletMiddleware({ getAccounts, processDecryptMessage, processEncryptionPublicKey, processEthSignMessage, processPersonalMessage, processTransaction, processTypedMessage, processTypedMessageV3, processTypedMessageV4, }: WalletMiddlewareOptions): JsonRpcMiddleware<string, Block>;
