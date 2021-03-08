/*
 * Calculate gasPrice based on last blocks.
 * @author github.com/axic
 *
 * FIXME: support minimum suggested gas and perhaps other options from geth:
 * https://github.com/ethereum/go-ethereum/blob/master/eth/gasprice.go
 * https://github.com/ethereum/go-ethereum/wiki/Gas-Price-Oracle
 */

import map from 'async/map';
import { JSONRPCRequest } from '../base-provider';
import { GasPriceError } from '../errors/gas-price-error';
import Subprovider, { CompletionHandler, NextHandler } from '../subprovider';

export interface GaspriceProviderOptions {
  numberOfBlocks?: number;
  delayInBlocks?: number;
}

export default class GaspriceProvider extends Subprovider {
  public numberOfBlocks: number;
  public delayInBlocks: number;

  constructor(opts?: GaspriceProviderOptions) {
    opts = opts || {};
    super();
    this.numberOfBlocks = opts.numberOfBlocks || 10;
    this.delayInBlocks = opts.delayInBlocks || 5;
  }

  public handleRequest(payload: JSONRPCRequest, next: NextHandler, end: CompletionHandler): void {
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
            return cb(GasPriceError.BlockNotFound(item));
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
        } else {
          median = Math.floor((transactions[half - 1] + transactions[half]) / 2.0);
        }

        end(null, median);
      };

      map(blockNumbers, getBlock, calcPrice);
    });
  }
}
