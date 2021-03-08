export enum BlockTrackerErrorCode {
  // Block data was not found after retries
  BlockNotFound = 3000,
}

/**
 * Represents errors that occur in the block tracker
 */
export class BlockTrackerError extends Error {

  public static BlockNotFound(blockNumber: string) {
    return new BlockTrackerError(`Could not load block ${blockNumber}`, BlockTrackerErrorCode.BlockNotFound);
  }

  public code: BlockTrackerErrorCode;

  constructor(message: string, code: BlockTrackerErrorCode) {
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlockTrackerError);
    }
    this.code = code;
  }
}
