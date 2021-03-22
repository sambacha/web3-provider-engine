"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
function assert(condition, message) {
    if (!condition) {
        throw message || 'Assertion failed';
    }
}
exports.assert = assert;
