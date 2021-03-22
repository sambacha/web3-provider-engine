/// <reference types="node" />
import PollingBlockTracker from 'eth-block-tracker';
import { EventEmitter } from 'events';
import { JSONRPCResponse } from '../base-provider';
export interface BlockTrackerOptions {
    provider: any;
    pollingInterval: number;
    blockTracker: any;
}
export interface EthereumBlockObject {
    number: string | null;
    hash: string | null;
    parentHash: string;
    nonce: string | null;
    mixHash: string;
    sha3Uncles: string;
    logsBloom: string | null;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: string;
    totalDifficulty: string;
    size: string;
    extraData: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    transactions: any[];
    uncles: string[];
}
export interface BufferBlock {
    number: Buffer;
    hash: Buffer;
    parentHash: Buffer;
    nonce: Buffer;
    mixHash: Buffer;
    sha3Uncles: Buffer;
    logsBloom: Buffer;
    transactionsRoot: Buffer;
    stateRoot: Buffer;
    receiptsRoot: Buffer;
    miner: Buffer;
    difficulty: Buffer;
    totalDifficulty: Buffer;
    size: Buffer;
    extraData: Buffer;
    gasLimit: Buffer;
    gasUsed: Buffer;
    timestamp: Buffer;
    transactions: any[];
}
export default class BlockTracker extends EventEmitter {
    currentBlock?: BufferBlock;
    currentBlockNumber?: string;
    protected _blockTracker: PollingBlockTracker;
    private blockTimeout;
    private maxBlockRetries;
    private provider;
    constructor(opts: BlockTrackerOptions);
    start(): void;
    stop(): void;
    getLatestBlock(): Promise<any>;
    protected createSubscriptions(): void;
    protected destroySubscriptions(): void;
    protected onLatest(blockNumber: string): void;
    protected loadBlock(blockNumber: string, callCount?: number): void;
    protected _getBlockByNumber(blockNumber: string): Promise<JSONRPCResponse>;
    protected updateBlock(block: EthereumBlockObject): void;
    protected _setCurrentBlock(bufferBlock: BufferBlock): void;
}
