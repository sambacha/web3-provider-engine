export declare enum BlockTrackerErrorCode {
    BlockNotFound = 3000
}
/**
 * Represents errors that occur in the block tracker
 */
export declare class BlockTrackerError extends Error {
    static BlockNotFound(blockNumber: string): BlockTrackerError;
    code: BlockTrackerErrorCode;
    constructor(message: string, code: BlockTrackerErrorCode);
}
