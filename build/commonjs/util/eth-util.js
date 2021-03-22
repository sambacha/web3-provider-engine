"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpad = exports.bufferToInt = exports.bufferToHex = exports.intToBuffer = exports.intToHex = exports.stripHexPrefix = exports.addHexPrefix = exports.toBuffer = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const ethjs_util_1 = __importDefault(require("ethjs-util"));
// Methods from ethereumjs-util
/**
 * Attempts to turn a value into a `Buffer`. As input it supports
 * `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param v the value
 */
function toBuffer(v) {
    if (!Buffer.isBuffer(v)) {
        if (Array.isArray(v)) {
            v = Buffer.from(v);
        }
        else if (typeof v === 'string') {
            if (ethjs_util_1.default.isHexString(v)) {
                v = Buffer.from(ethjs_util_1.default.padToEven(ethjs_util_1.default.stripHexPrefix(v)), 'hex');
            }
            else {
                throw new TypeError(
                // tslint:disable-next-line: max-line-length
                `Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`);
            }
        }
        else if (typeof v === 'number') {
            v = ethjs_util_1.default.intToBuffer(v);
        }
        else if (v === null || v === undefined) {
            v = Buffer.allocUnsafe(0);
        }
        else if (bn_js_1.default.isBN(v)) {
            v = v.toArrayLike(Buffer);
        }
        else if (v.toArray) {
            // converts a BN to a Buffer
            v = Buffer.from(v.toArray());
        }
        else {
            throw new TypeError(`invalid type: ${v}`);
        }
    }
    return v;
}
exports.toBuffer = toBuffer;
/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
function addHexPrefix(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return ethjs_util_1.default.isHexPrefixed(str) ? str : '0x' + str;
}
exports.addHexPrefix = addHexPrefix;
function stripHexPrefix(str) {
    return ethjs_util_1.default.stripHexPrefix(str);
}
exports.stripHexPrefix = stripHexPrefix;
function intToHex(n) {
    return ethjs_util_1.default.intToHex(n);
}
exports.intToHex = intToHex;
function intToBuffer(n) {
    return ethjs_util_1.default.intToBuffer(n);
}
exports.intToBuffer = intToBuffer;
/**
 * Converts a `Buffer` into a hex `String`.
 * @param buf `Buffer` object to convert
 */
function bufferToHex(buf) {
    buf = toBuffer(buf);
    return '0x' + buf.toString('hex');
}
exports.bufferToHex = bufferToHex;
/**
 * Converts a `Buffer` to a `Number`.
 * @param buf `Buffer` object to convert
 * @throws If the input number exceeds 53 bits.
 */
function bufferToInt(buf) {
    return new bn_js_1.default(toBuffer(buf)).toNumber();
}
exports.bufferToInt = bufferToInt;
/**
 * Trims leading zeros from a `Buffer` or an `Array`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
function unpad(a) {
    a = ethjs_util_1.default.stripHexPrefix(a);
    let first = a[0];
    while (a.length > 0 && first.toString() === '0') {
        a = a.slice(1);
        first = a[0];
    }
    return a;
}
exports.unpad = unpad;
