import extend from 'xtend';
import FixtureProvider from '../../src/subproviders/fixture';
import { addHexPrefix, bufferToHex, intToHex, stripHexPrefix, toBuffer } from '../../src/util/eth-util';

export default class TestBlockProvider extends FixtureProvider {

  public _blockChain: any;
  public _pendingTxs: any[];
  public _currentBlock?: any;

  constructor() {
    super({});
    this._blockChain = {};
    this._pendingTxs = [];
    this.nextBlock();
    this.staticResponses = {
      eth_blockNumber: (payload, next, end) => {
        const block = this._currentBlock;
        const result = (block && block.number) || null;
        setTimeout(() => end(null, result));
      },
      eth_getBlockByNumber: (payload, next, end) => {
        const blockRef = payload.params[0];
        const result = this.getBlockByRef(blockRef);
        // return result asynchronously
        setTimeout(() => end(null, result));
      },
      eth_getLogs: (payload, next, end) => {
        const transactions = this._currentBlock.transactions;
        const logs = transactions.map((tx) => {
          return {
            address: tx._logAddress,
            blockNumber: tx.blockNumber,
            blockHash: tx.blockHash,
            data: tx._logData,
            logIndex: tx.transactionIndex,
            topics: tx._logTopics,
            transactionIndex: tx.transactionIndex,
            transactionHash: tx.hash,
          };
        });
        // return result asynchronously
        setTimeout(() => end(null, logs));
      },
    };
  }

  public createBlock(blockParams?, prevBlock?, txs?) {
    blockParams = blockParams || {};
    txs = txs || [];
    const defaultNumber = prevBlock ? this.incrementHex(prevBlock.number) : '0x1';
    const defaultGasLimit = intToHex(4712388);
    return extend({
      // defaults
      number:            defaultNumber,
      hash:              randomHash(),
      parentHash:        prevBlock ? prevBlock.hash : randomHash(),
      nonce:             randomHash(),
      mixHash:           randomHash(),
      sha3Uncles:        randomHash(),
      logsBloom:         randomHash(),
      transactionsRoot:  randomHash(),
      stateRoot:         randomHash(),
      receiptsRoot:      randomHash(),
      miner:             randomHash(),
      difficulty:        randomHash(),
      totalDifficulty:   randomHash(),
      size:              randomHash(),
      extraData:         randomHash(),
      gasLimit:          defaultGasLimit,
      gasUsed:           randomHash(),
      timestamp:         randomHash(),
      transactions:      txs,
      // provided
    }, blockParams);
  }

  public incrementHex(hexString) {
    return stripLeadingZeroes(intToHex(Number(hexString) + 1));
  }

  public getBlockByRef(blockRef) {
    if (blockRef === 'latest') {
      return this._currentBlock;
    } else {
      // if present, return block at reference
      let block = this._blockChain[blockRef];
      if (block) { return block; }
      // check if we should create the new block
      const blockNum = Number(blockRef);
      if (blockNum > Number(this._currentBlock.number)) { return; }
      // create, store, and return the new block
      block = this.createBlock({ number: blockRef });
      this._blockChain[blockRef] = block;
      return block;
    }
  }

  public nextBlock(blockParams?) {
    const newBlock = this.createBlock(blockParams, this._currentBlock, this._pendingTxs);
    this._pendingTxs = [];
    this._currentBlock = newBlock;
    this._blockChain[newBlock.number] = newBlock;
    return this._currentBlock;
  }

  public addTx(txParams) {
    const newTx = extend({
      // defaults
      address: randomHash(),
      topics: [
        randomHash(),
        randomHash(),
        randomHash(),
      ],
      data: randomHash(),
      blockNumber: '0xdeadbeef',
      logIndex: '0xdeadbeef',
      blockHash: '0x7c337eac9e3ec7bc99a1d911d326389558c9086afca7480a19698a16e40b2e0a',
      transactionHash: '0xd81da851bd3f4094d52cb86929e2ea3732a60ba7c184b853795fc5710a68b5fa',
      transactionIndex: '0x0',
      // provided
    }, txParams);
    this._pendingTxs.push(newTx);
    return newTx;
  }
}

function randomHash() {
  return bufferToHex(toBuffer(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
}

function stripLeadingZeroes(hexString) {
  let strippedHex = stripHexPrefix(hexString);
  while (strippedHex[0] === '0') {
    strippedHex = strippedHex.substr(1);
  }
  return addHexPrefix(strippedHex);
}
