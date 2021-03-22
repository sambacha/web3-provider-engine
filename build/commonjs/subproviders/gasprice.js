"use strict";
/*
 * Calculate gasPrice based on last blocks.
 * @author github.com/axic
 *
 * FIXME: support minimum suggested gas and perhaps other options from geth:
 * https://github.com/ethereum/go-ethereum/blob/master/eth/gasprice.go
 * https://github.com/ethereum/go-ethereum/wiki/Gas-Price-Oracle
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = __importDefault(require("async/map"));
const gas_price_error_1 = require("../errors/gas-price-error");
const subprovider_1 = __importDefault(require("../subprovider"));
class GaspriceProvider extends subprovider_1.default {
    constructor(opts) {
        opts = opts || {};
        super();
        this.numberOfBlocks = opts.numberOfBlocks || 10;
        this.delayInBlocks = opts.delayInBlocks || 5;
    }
    handleRequest(payload, next, end) {
        if (payload.method !== 'eth_gasPrice') {
            return next();
        }
        const p = { id: 0, jsonrpc: '2.0', method: 'eth_blockNumber', params: [] };
        this.emitPayload(p, (_, res) => {
            // FIXME: convert number using a bignum library
            let lastBlock = parseInt(res.result, 16) - this.delayInBlocks;
            const blockNumbers = [];
            for (let i = 0; i < this.numberOfBlocks; i++) {
                blockNumbers.push('0x' + lastBlock.toString(16));
                lastBlock--;
            }
            const getBlock = (item, cb) => {
                const p2 = { id: 0, jsonrpc: '2.0', method: 'eth_getBlockByNumber', params: [item, true] };
                this.emitPayload(p2, (err, blockRes) => {
                    if (err) {
                        return cb(err);
                    }
                    if (!blockRes.result) {
                        return cb(gas_price_error_1.GasPriceError.BlockNotFound(item));
                    }
                    cb(null, blockRes.result.transactions);
                });
            };
            // FIXME: this could be made much faster
            const calcPrice = (err, transactions) => {
                // flatten array
                transactions = transactions.reduce((a, b) => a.concat(b), []);
                // leave only the gasprice
                // FIXME: convert number using a bignum library
                transactions = transactions.map((a) => parseInt(a.gasPrice, 16), []);
                // order ascending
                transactions.sort((a, b) => a - b);
                // ze median
                const half = Math.floor(transactions.length / 2);
                let median;
                if (transactions.length % 2) {
                    median = transactions[half];
                }
                else {
                    median = Math.floor((transactions[half - 1] + transactions[half]) / 2.0);
                }
                end(null, median);
            };
            map_1.default(blockNumbers, getBlock, calcPrice);
        });
    }
}
exports.default = GaspriceProvider;
