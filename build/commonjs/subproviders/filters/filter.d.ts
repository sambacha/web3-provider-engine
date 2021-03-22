/// <reference types="node" />
import { EventEmitter } from 'events';
export default abstract class Filter extends EventEmitter {
    abstract update(logs: any): void;
    abstract getChanges(): any[];
    abstract clearChanges(): void;
}
