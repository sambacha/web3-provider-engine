import Filter from './filter';
export default class PendingTransactionFilter extends Filter {
    protected type: string;
    protected updates: any[];
    protected allResults: any[];
    constructor();
    update(txs: any): void;
    getChanges(): any[];
    getAllResults(): any[];
    clearChanges(): void;
    protected validateUnique(tx: any): boolean;
}
