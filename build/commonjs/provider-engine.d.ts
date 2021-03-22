import BaseProvider, { JSONRPCRequest, JSONRPCResponse, JSONRPCResponseHandler } from './base-provider';
import { default as Subprovider } from './subprovider';
import BlockTracker, { BufferBlock } from './util/block-tracker';
import Stoplight from './util/stoplight';
export interface ProviderEngineOptions {
    blockTracker?: any;
    blockTrackerProvider?: any;
    pollingInterval?: number;
    pollingShouldUnref?: boolean;
    disableBlockTracking?: boolean;
    debug?: boolean;
}
export default class Web3ProviderEngine extends BaseProvider {
    currentBlock?: BufferBlock;
    protected _blockTracker: BlockTracker;
    protected _ready: Stoplight;
    protected _providers: Subprovider[];
    protected _pollForBlocks: boolean;
    protected _running: boolean;
    constructor(opts?: ProviderEngineOptions);
    isRunning(): boolean;
    start(): void;
    stop(): void;
    addProvider(source: Subprovider, index?: number): void;
    removeProvider(source: Subprovider): void;
    send(method: string, params: any[]): Promise<any>;
    sendAsync(payload: JSONRPCRequest | JSONRPCRequest[], cb: JSONRPCResponseHandler): void;
    protected sendPayload(payload: JSONRPCRequest): Promise<JSONRPCResponse>;
    protected _setCurrentBlock(bufferBlock: BufferBlock): void;
    private _getBlockByNumber;
    private _handleAsync;
}
