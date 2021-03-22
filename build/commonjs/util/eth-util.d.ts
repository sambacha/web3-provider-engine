/**
 * Attempts to turn a value into a `Buffer`. As input it supports
 * `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param v the value
 */
export declare function toBuffer(v: any): any;
/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
export declare function addHexPrefix(str: any): any;
export declare function stripHexPrefix(str: any): any;
export declare function intToHex(n: any): any;
export declare function intToBuffer(n: any): any;
/**
 * Converts a `Buffer` into a hex `String`.
 * @param buf `Buffer` object to convert
 */
export declare function bufferToHex(buf: any): string;
/**
 * Converts a `Buffer` to a `Number`.
 * @param buf `Buffer` object to convert
 * @throws If the input number exceeds 53 bits.
 */
export declare function bufferToInt(buf: any): number;
/**
 * Trims leading zeros from a `Buffer` or an `Array`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
export declare function unpad(a: any): any;
