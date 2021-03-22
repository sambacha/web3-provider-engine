"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasPriceError = exports.GasPriceErrorCode = void 0;
var GasPriceErrorCode;
(function (GasPriceErrorCode) {
    GasPriceErrorCode[GasPriceErrorCode["BlockNotFound"] = 4000] = "BlockNotFound";
})(GasPriceErrorCode = exports.GasPriceErrorCode || (exports.GasPriceErrorCode = {}));
/**
 * Represents errors that occur in the gas price subprovider
 */
class GasPriceError extends Error {
    constructor(message, code) {
        super(message);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GasPriceError);
        }
        this.code = code;
    }
    static BlockNotFound(blockNumber) {
        const msg = `Could not calculate gas. Block ${blockNumber} was not found`;
        return new GasPriceError(msg, GasPriceErrorCode.BlockNotFound);
    }
}
exports.GasPriceError = GasPriceError;
