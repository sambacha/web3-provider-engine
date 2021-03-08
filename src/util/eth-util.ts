import BN from 'bn.js';
import ethjsUtil from 'ethjs-util';

// Methods from ethereumjs-util

/**
 * Attempts to turn a value into a `Buffer`. As input it supports
 * `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param v the value
 */
export function toBuffer(v) {
  if (!Buffer.isBuffer(v)) {
    if (Array.isArray(v)) {
      v = Buffer.from(v);
    } else if (typeof v === 'string') {
      if (ethjsUtil.isHexString(v)) {
        v = Buffer.from(ethjsUtil.padToEven(ethjsUtil.stripHexPrefix(v)), 'hex');
      } else {
        throw new TypeError(
          // tslint:disable-next-line: max-line-length
          `Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`,
        );
      }
    } else if (typeof v === 'number') {
      v = ethjsUtil.intToBuffer(v);
    } else if (v === null || v === undefined) {
      v = Buffer.allocUnsafe(0);
    } else if (BN.isBN(v)) {
      v = v.toArrayLike(Buffer);
    } else if (v.toArray) {
      // converts a BN to a Buffer
      v = Buffer.from(v.toArray());
    } else {
      throw new TypeError(`invalid type: ${v}`);
    }
  }
  return v;
}

/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
export function addHexPrefix(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return ethjsUtil.isHexPrefixed(str) ? str : '0x' + str;
}

export function stripHexPrefix(str) {
  return ethjsUtil.stripHexPrefix(str);
}

export function intToHex(n) {
  return ethjsUtil.intToHex(n);
}

export function intToBuffer(n) {
  return ethjsUtil.intToBuffer(n);
}

/**
 * Converts a `Buffer` into a hex `String`.
 * @param buf `Buffer` object to convert
 */
export function bufferToHex(buf) {
  buf = toBuffer(buf);
  return '0x' + buf.toString('hex');
}

/**
 * Converts a `Buffer` to a `Number`.
 * @param buf `Buffer` object to convert
 * @throws If the input number exceeds 53 bits.
 */
export function bufferToInt(buf) {
  return new BN(toBuffer(buf)).toNumber();
}

/**
 * Trims leading zeros from a `Buffer` or an `Array`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
export function unpad(a) {
  a = ethjsUtil.stripHexPrefix(a);
  let first = a[0];
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1);
    first = a[0];
  }
  return a;
}
