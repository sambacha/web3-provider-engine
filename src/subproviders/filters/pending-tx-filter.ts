import Filter from './filter';

//
// PendingTxFilter
//
export default class PendingTransactionFilter extends Filter {
  protected type: string;
  protected updates: any[];
  protected allResults: any[];

  constructor() {
    // console.log('PendingTransactionFilter - new')
    super();
    this.type = 'pendingTx';
    this.updates = [];
    this.allResults = [];
  }

  public update(txs) {
    // console.log('PendingTransactionFilter - update')
    const validTxs = [];
    txs.forEach((tx) => {
      // validate filter match
      const validated = this.validateUnique(tx);
      if (!validated) {
        return;
      }
      // add to results
      validTxs.push(tx);
      this.updates.push(tx);
      this.allResults.push(tx);
    });
    if (validTxs.length > 0) {
      this.emit('data', validTxs);
    }
  }

  public getChanges() {
    // console.log('PendingTransactionFilter - getChanges')
    return this.updates;
  }

  public getAllResults() {
    // console.log('PendingTransactionFilter - getAllResults')
    return this.allResults;
  }

  public clearChanges() {
    // console.log('PendingTransactionFilter - clearChanges')
    this.updates = [];
  }

  protected validateUnique(tx) {
    return this.allResults.indexOf(tx) === -1;
  }
}
