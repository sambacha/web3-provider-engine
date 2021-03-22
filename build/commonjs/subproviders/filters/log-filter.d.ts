import Filter from './filter';
export default class LogFilter extends Filter {
    protected type: string;
    protected fromBlock: string;
    protected toBlock: string;
    protected address: string[];
    protected topics: any[];
    protected updates: any[];
    protected allResults: any[];
    constructor(opts: any);
    update(logs: any): void;
    getChanges(): any[];
    getAllResults(): any[];
    clearChanges(): void;
    protected validateLog(log: any): any;
}
