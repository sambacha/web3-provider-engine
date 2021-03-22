"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderEngineError = exports.ProviderEngineErrorCode = void 0;
var ProviderEngineErrorCode;
(function (ProviderEngineErrorCode) {
    ProviderEngineErrorCode[ProviderEngineErrorCode["UnhandledRequest"] = 1000] = "UnhandledRequest";
    ProviderEngineErrorCode[ProviderEngineErrorCode["MissingImplementation"] = 1001] = "MissingImplementation";
    ProviderEngineErrorCode[ProviderEngineErrorCode["UnsupportedFeature"] = 1002] = "UnsupportedFeature";
})(ProviderEngineErrorCode = exports.ProviderEngineErrorCode || (exports.ProviderEngineErrorCode = {}));
/**
 * Represents errors specific to ProviderEngine
 */
class ProviderEngineError extends Error {
    constructor(message, code) {
        super(message);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProviderEngineError);
        }
        this.code = code;
    }
}
exports.ProviderEngineError = ProviderEngineError;
