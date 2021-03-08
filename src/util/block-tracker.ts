import PollingBlockTracker from 'eth-block-tracker';
import { EventEmitter } from 'events';
import { JSONRPCResponse } from '../base-provider';
import { BlockTrackerError } from '../errors/block-tracker-error';
import { createPayload } from './create-payload';
import { toBuffer } from './eth-util';

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

// Class responsible for tracking new blocks as they are mined,
// loading them, parsing them, and alerting subscribers via events.
export default class BlockTracker extends EventEmitter {
  // The latest block data we have received
  public currentBlock?: BufferBlock;

  // The latest block number we have received
  public currentBlockNumber?: string;

  // Internal block tracker implementation
  protected _blockTracker: PollingBlockTracker;

  // Number of milliseconds to wait before retrying
  private blockTimeout = 300;

  // Maximum attempts to load a block
  private maxBlockRetries = 3;

  // Provider to send web3 calls
  private provider: any;

  constructor(opts: BlockTrackerOptions) {
    super();
    this.provider = opts.provider;
    this._blockTracker = opts.blockTracker || new PollingBlockTracker({
      ...opts,
      setSkipCacheFlag: true,
    });
  }

  public start() {
    this.createSubscriptions();
  }

  public stop() {
    this.destroySubscriptions();
  }

  public getLatestBlock(): Promise<any> {
    return this._blockTracker.checkForLatestBlock().catch((error) => {
      this.emit('error', error);
    });
  }

  protected createSubscriptions() {
    // on new block, request block body and emit as events
    this._blockTracker.on('latest', this.onLatest.bind(this));
    // forward other events
    this._blockTracker.on('sync', this.emit.bind(this, 'sync'));
    this._blockTracker.on('error', this.emit.bind(this, 'error'));
  }

  protected destroySubscriptions() {
    // stop block polling by removing event listeners
    this._blockTracker.removeAllListeners();
  }

  protected onLatest(blockNumber: string) {
    this.currentBlockNumber = blockNumber;
    this.loadBlock(blockNumber);
  }

  // Tries to get the block payload recursively
  protected loadBlock(blockNumber: string, callCount = 0) {
    this._getBlockByNumber(blockNumber).then((blockResponse) => {
      // Result can be null if the block hasn't fully propagated to the nodes
      if (blockResponse.result) {
        this.updateBlock(blockResponse.result);
      } else if (callCount < this.maxBlockRetries && blockNumber === this.currentBlockNumber) {
        // Only call recursively if the current block number is still the same
        // and if we are under the retry limit.
        setTimeout(() => {
          this.loadBlock(blockNumber, callCount + 1);
        }, this.blockTimeout);
      } else {
        throw BlockTrackerError.BlockNotFound(blockNumber);
      }
    }).catch((err) => {
      // Don't retry for errors (provider should have already retried)
      this.emit('error', err);
    });
  }

  protected _getBlockByNumber(blockNumber: string): Promise<JSONRPCResponse> {
    const req = createPayload({ method: 'eth_getBlockByNumber', params: [blockNumber, false], skipCache: true });
    return new Promise((fulfill, reject) => {
      this.provider.sendAsync(req, (err, result) => {
        if (err) {
          return reject(err);
        }
        fulfill(result);
      });
    });
  }

  // Parse the block into a buffer representation and update subscribers.
  protected updateBlock(block: EthereumBlockObject) {
    const bufferBlock = toBufferBlock(block);
    // set current + emit "block" event
    this._setCurrentBlock(bufferBlock);
    // emit other events
    this.emit('rawBlock', block);
    this.emit('latest', block);
  }

  protected _setCurrentBlock(bufferBlock: BufferBlock) {
    this.currentBlock = bufferBlock;
    this.emit('block', bufferBlock);
  }
}

// util
function toBufferBlock(jsonBlock: EthereumBlockObject): BufferBlock {
  return {
    number:           toBuffer(jsonBlock.number),
    hash:             toBuffer(jsonBlock.hash),
    parentHash:       toBuffer(jsonBlock.parentHash),
    nonce:            toBuffer(jsonBlock.nonce),
    mixHash:          toBuffer(jsonBlock.mixHash),
    sha3Uncles:       toBuffer(jsonBlock.sha3Uncles),
    logsBloom:        toBuffer(jsonBlock.logsBloom),
    transactionsRoot: toBuffer(jsonBlock.transactionsRoot),
    stateRoot:        toBuffer(jsonBlock.stateRoot),
    receiptsRoot:     toBuffer(jsonBlock.receiptsRoot),
    miner:            toBuffer(jsonBlock.miner),
    difficulty:       toBuffer(jsonBlock.difficulty),
    totalDifficulty:  toBuffer(jsonBlock.totalDifficulty),
    size:             toBuffer(jsonBlock.size),
    extraData:        toBuffer(jsonBlock.extraData),
    gasLimit:         toBuffer(jsonBlock.gasLimit),
    gasUsed:          toBuffer(jsonBlock.gasUsed),
    timestamp:        toBuffer(jsonBlock.timestamp),
    transactions:     jsonBlock.transactions,
  };
}
