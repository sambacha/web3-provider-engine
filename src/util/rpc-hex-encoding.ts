import { assert } from './assert';
import { addHexPrefix, bufferToInt, stripHexPrefix, toBuffer, unpad } from './eth-util';

/*
 * As per https://github.com/ethereum/wiki/wiki/JSON-RPC#hex-value-encoding
 * Quantities should be represented by the most compact hex representation possible
 * This means that no leading zeroes are allowed. There helpers make it easy
 * to convert to and from integers and their compact hex representation
 */

export function bufferToQuantityHex(buffer) {
  buffer = toBuffer(buffer);
  const hex = buffer.toString('hex');
  const trimmed = unpad(hex);
  return addHexPrefix(trimmed);
}

export function intToQuantityHex(n) {
  assert(typeof n === 'number' && n === Math.floor(n), 'intToQuantityHex arg must be an integer');
  let nHex = toBuffer(n).toString('hex');
  if (nHex[0] === '0') {
    nHex = nHex.substring(1);
  }
  return addHexPrefix(nHex);
}

export function quantityHexToInt(prefixedQuantityHex) {
  assert(typeof prefixedQuantityHex === 'string', 'arg to quantityHexToInt must be a string');
  let quantityHex = stripHexPrefix(prefixedQuantityHex);
  const isEven = quantityHex.length % 2 === 0;
  if (!isEven) {
    quantityHex = '0' + quantityHex;
  }
  const buf = new Buffer(quantityHex, 'hex');
  return bufferToInt(buf);
}
