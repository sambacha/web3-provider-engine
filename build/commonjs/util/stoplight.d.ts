/// <reference types="node" />
import { EventEmitter } from 'events';
export default class Stoplight extends EventEmitter {
    isLocked: boolean;
    constructor();
    go(): void;
    stop(): void;
    await(fn: any): void;
}
