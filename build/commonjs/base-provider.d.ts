/// <reference types="node" />
import { EventEmitter } from 'events';
export interface JSONRPCResponse {
    id: number;
    jsonrpc: string;
    error?: any;
    result?: any;
}
export interface JSONRPCRequest {
    id?: number;
    jsonrpc?: string;
    method: string;
    params: any[];
    skipCache?: boolean;
    origin?: any;
}
export declare type JSONRPCResponseHandler = (error: null | Error, response: JSONRPCResponse) => void;
export default abstract class BaseProvider extends EventEmitter {
    send(method: string, params?: any[]): Promise<any>;
    sendAsync(payload: JSONRPCRequest, cb: JSONRPCResponseHandler): void;
    supportsSubscriptions(): boolean;
    subscribe(_subscribeMethod: string, _subscriptionMethod: string, _parameters: any): Promise<string>;
    unsubscribe(_subscriptionId: string, _unsubscribeMethod: string): Promise<boolean>;
    protected abstract sendPayload(payload: JSONRPCRequest): Promise<JSONRPCResponse>;
}
