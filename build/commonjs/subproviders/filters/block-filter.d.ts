import Web3ProviderEngine from '../..';
import Filter from './filter';
export default class BlockFilter extends Filter {
    protected type: string;
    protected engine: Web3ProviderEngine;
    protected blockNumber: number;
    protected updates: any[];
    constructor(opts: any);
    update(block: any): void;
    getChanges(): any[];
    clearChanges(): void;
}
