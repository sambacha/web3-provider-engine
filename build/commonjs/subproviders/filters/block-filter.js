"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = __importDefault(require("./filter"));
//
// BlockFilter
//
class BlockFilter extends filter_1.default {
    constructor(opts) {
        // console.log('BlockFilter - new')
        super();
        this.type = 'block';
        this.engine = opts.engine;
        this.blockNumber = opts.blockNumber;
        this.updates = [];
    }
    update(block) {
        const blockHash = bufferToHex(block.hash);
        this.updates.push(blockHash);
        this.emit('data', block);
    }
    getChanges() {
        // console.log('BlockFilter - getChanges:', results.length)
        return this.updates;
    }
    clearChanges() {
        // console.log('BlockFilter - clearChanges')
        this.updates = [];
    }
}
exports.default = BlockFilter;
function bufferToHex(buffer) {
    return '0x' + buffer.toString('hex');
}
