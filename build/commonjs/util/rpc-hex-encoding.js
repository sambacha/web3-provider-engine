"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityHexToInt = exports.intToQuantityHex = exports.bufferToQuantityHex = void 0;
const assert_1 = require("./assert");
const eth_util_1 = require("./eth-util");
/*
 * As per https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
 * Quantities should be represented by the most compact hex representation possible
 * This means that no leading zeroes are allowed. There helpers make it easy
 * to convert to and from integers and their compact hex representation
 */
function bufferToQuantityHex(buffer) {
    buffer = eth_util_1.toBuffer(buffer);
    const hex = buffer.toString('hex');
    const trimmed = eth_util_1.unpad(hex);
    return eth_util_1.addHexPrefix(trimmed);
}
exports.bufferToQuantityHex = bufferToQuantityHex;
function intToQuantityHex(n) {
    assert_1.assert(typeof n === 'number' && n === Math.floor(n), 'intToQuantityHex arg must be an integer');
    let nHex = eth_util_1.toBuffer(n).toString('hex');
    if (nHex[0] === '0') {
        nHex = nHex.substring(1);
    }
    return eth_util_1.addHexPrefix(nHex);
}
exports.intToQuantityHex = intToQuantityHex;
function quantityHexToInt(prefixedQuantityHex) {
    assert_1.assert(typeof prefixedQuantityHex === 'string', 'arg to quantityHexToInt must be a string');
    let quantityHex = eth_util_1.stripHexPrefix(prefixedQuantityHex);
    const isEven = quantityHex.length % 2 === 0;
    if (!isEven) {
        quantityHex = '0' + quantityHex;
    }
    const buf = new Buffer(quantityHex, 'hex');
    return eth_util_1.bufferToInt(buf);
}
exports.quantityHexToInt = quantityHexToInt;
