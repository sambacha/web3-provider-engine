import Web3ProviderEngine from '../..';
import Filter from './filter';

//
// BlockFilter
//
export default class BlockFilter extends Filter {
  protected type: string;
  protected engine: Web3ProviderEngine;
  protected blockNumber: number;
  protected updates: any[];

  constructor(opts) {
    // console.log('BlockFilter - new')
    super();
    this.type = 'block';
    this.engine = opts.engine;
    this.blockNumber = opts.blockNumber;
    this.updates = [];
  }

  public update(block) {
    const blockHash = bufferToHex(block.hash);
    this.updates.push(blockHash);
    this.emit('data', block);
  }

  public getChanges() {
    // console.log('BlockFilter - getChanges:', results.length)
    return this.updates;
  }

  public clearChanges() {
    // console.log('BlockFilter - clearChanges')
    this.updates = [];
  }
}

function bufferToHex(buffer) {
  return '0x' + buffer.toString('hex');
}
