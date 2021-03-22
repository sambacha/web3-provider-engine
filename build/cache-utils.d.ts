import { JsonRpcRequest, PendingJsonRpcResponse } from 'json-rpc-engine';
import SafeEventEmitter from '@metamask/safe-event-emitter';
export declare type Payload = Partial<JsonRpcRequest<string[]>>;
export interface JsonRpcRequestToCache extends JsonRpcRequest<string[]> {
    skipCache: boolean;
}
export declare type BlockData = string | string[];
export declare type Block = Record<string, BlockData>;
export declare type BlockCache = Record<string, Block>;
export declare type Cache = Record<number, BlockCache>;
export declare type SendAsyncCallBack = (err: Error, providerRes: PendingJsonRpcResponse<Block>) => void;
export interface SafeEventEmitterProvider extends SafeEventEmitter {
    sendAsync: (req: JsonRpcRequest<string[]>, callback: SendAsyncCallBack) => void;
    send: (req: JsonRpcRequest<string[]>, callback: VoidFunction) => void;
}
export declare function cacheIdentifierForPayload(payload: Payload, skipBlockRef?: boolean): string | null;
export declare function canCache(payload: Payload): boolean;
export declare function blockTagForPayload(payload: Payload): string | undefined;
export declare function paramsWithoutBlockTag(payload: Payload): string[];
export declare function blockTagParamIndex(payload: Payload): number | undefined;
export declare function cacheTypeForPayload(payload: Payload): string;
