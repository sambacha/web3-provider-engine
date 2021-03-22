"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockTrackerError = exports.BlockTrackerErrorCode = void 0;
var BlockTrackerErrorCode;
(function (BlockTrackerErrorCode) {
    // Block data was not found after retries
    BlockTrackerErrorCode[BlockTrackerErrorCode["BlockNotFound"] = 3000] = "BlockNotFound";
})(BlockTrackerErrorCode = exports.BlockTrackerErrorCode || (exports.BlockTrackerErrorCode = {}));
/**
 * Represents errors that occur in the block tracker
 */
class BlockTrackerError extends Error {
    constructor(message, code) {
        super(message);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BlockTrackerError);
        }
        this.code = code;
    }
    static BlockNotFound(blockNumber) {
        return new BlockTrackerError(`Could not load block ${blockNumber}`, BlockTrackerErrorCode.BlockNotFound);
    }
}
exports.BlockTrackerError = BlockTrackerError;
