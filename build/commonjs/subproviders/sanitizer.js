"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subprovider_1 = __importDefault(require("../subprovider"));
const eth_util_1 = require("../util/eth-util");
class SanitizerSubprovider extends subprovider_1.default {
    handleRequest(payload, next, _end) {
        const txParams = payload.params[0];
        if (typeof txParams === 'object' && !Array.isArray(txParams)) {
            const sanitized = cloneTxParams(txParams);
            payload.params[0] = sanitized;
        }
        next();
    }
}
exports.default = SanitizerSubprovider;
// we use this to clean any custom params from the txParams
const permitted = [
    'from',
    'to',
    'value',
    'data',
    'gas',
    'gasPrice',
    'nonce',
    'fromBlock',
    'toBlock',
    'address',
    'topics',
];
function cloneTxParams(txParams) {
    const sanitized = permitted.reduce((copy, p) => {
        if (p in txParams) {
            if (Array.isArray(txParams[p])) {
                copy[p] = txParams[p].map((item) => sanitize(item));
            }
            else {
                copy[p] = sanitize(txParams[p]);
            }
        }
        return copy;
    }, {});
    return sanitized;
}
function sanitize(value) {
    switch (value) {
        case 'latest':
            return value;
        case 'pending':
            return value;
        case 'earliest':
            return value;
        default:
            if (typeof value === 'string') {
                return eth_util_1.addHexPrefix(value.toLowerCase());
            }
            else {
                return value;
            }
    }
}
