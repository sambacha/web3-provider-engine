"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_block_tracker_1 = __importDefault(require("eth-block-tracker"));
const events_1 = require("events");
const block_tracker_error_1 = require("../errors/block-tracker-error");
const create_payload_1 = require("./create-payload");
const eth_util_1 = require("./eth-util");
// Class responsible for tracking new blocks as they are mined,
// loading them, parsing them, and alerting subscribers via events.
class BlockTracker extends events_1.EventEmitter {
    constructor(opts) {
        super();
        // Number of milliseconds to wait before retrying
        this.blockTimeout = 300;
        // Maximum attempts to load a block
        this.maxBlockRetries = 3;
        this.provider = opts.provider;
        this._blockTracker = opts.blockTracker || new eth_block_tracker_1.default(Object.assign(Object.assign({}, opts), { setSkipCacheFlag: true }));
    }
    start() {
        this.createSubscriptions();
    }
    stop() {
        this.destroySubscriptions();
    }
    getLatestBlock() {
        return this._blockTracker.checkForLatestBlock().catch((error) => {
            this.emit('error', error);
        });
    }
    createSubscriptions() {
        // on new block, request block body and emit as events
        this._blockTracker.on('latest', this.onLatest.bind(this));
        // forward other events
        this._blockTracker.on('sync', this.emit.bind(this, 'sync'));
        this._blockTracker.on('error', this.emit.bind(this, 'error'));
    }
    destroySubscriptions() {
        // stop block polling by removing event listeners
        this._blockTracker.removeAllListeners();
    }
    onLatest(blockNumber) {
        this.currentBlockNumber = blockNumber;
        this.loadBlock(blockNumber);
    }
    // Tries to get the block payload recursively
    loadBlock(blockNumber, callCount = 0) {
        this._getBlockByNumber(blockNumber).then((blockResponse) => {
            // Result can be null if the block hasn't fully propagated to the nodes
            if (blockResponse.result) {
                this.updateBlock(blockResponse.result);
            }
            else if (callCount < this.maxBlockRetries && blockNumber === this.currentBlockNumber) {
                // Only call recursively if the current block number is still the same
                // and if we are under the retry limit.
                setTimeout(() => {
                    this.loadBlock(blockNumber, callCount + 1);
                }, this.blockTimeout);
            }
            else {
                throw block_tracker_error_1.BlockTrackerError.BlockNotFound(blockNumber);
            }
        }).catch((err) => {
            // Don't retry for errors (provider should have already retried)
            this.emit('error', err);
        });
    }
    _getBlockByNumber(blockNumber) {
        const req = create_payload_1.createPayload({ method: 'eth_getBlockByNumber', params: [blockNumber, false], skipCache: true });
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
    updateBlock(block) {
        const bufferBlock = toBufferBlock(block);
        // set current + emit "block" event
        this._setCurrentBlock(bufferBlock);
        // emit other events
        this.emit('rawBlock', block);
        this.emit('latest', block);
    }
    _setCurrentBlock(bufferBlock) {
        this.currentBlock = bufferBlock;
        this.emit('block', bufferBlock);
    }
}
exports.default = BlockTracker;
// util
function toBufferBlock(jsonBlock) {
    return {
        number: eth_util_1.toBuffer(jsonBlock.number),
        hash: eth_util_1.toBuffer(jsonBlock.hash),
        parentHash: eth_util_1.toBuffer(jsonBlock.parentHash),
        nonce: eth_util_1.toBuffer(jsonBlock.nonce),
        mixHash: eth_util_1.toBuffer(jsonBlock.mixHash),
        sha3Uncles: eth_util_1.toBuffer(jsonBlock.sha3Uncles),
        logsBloom: eth_util_1.toBuffer(jsonBlock.logsBloom),
        transactionsRoot: eth_util_1.toBuffer(jsonBlock.transactionsRoot),
        stateRoot: eth_util_1.toBuffer(jsonBlock.stateRoot),
        receiptsRoot: eth_util_1.toBuffer(jsonBlock.receiptsRoot),
        miner: eth_util_1.toBuffer(jsonBlock.miner),
        difficulty: eth_util_1.toBuffer(jsonBlock.difficulty),
        totalDifficulty: eth_util_1.toBuffer(jsonBlock.totalDifficulty),
        size: eth_util_1.toBuffer(jsonBlock.size),
        extraData: eth_util_1.toBuffer(jsonBlock.extraData),
        gasLimit: eth_util_1.toBuffer(jsonBlock.gasLimit),
        gasUsed: eth_util_1.toBuffer(jsonBlock.gasUsed),
        timestamp: eth_util_1.toBuffer(jsonBlock.timestamp),
        transactions: jsonBlock.transactions,
    };
}
