export enum GasPriceErrorCode {
  BlockNotFound = 4000,
}

/**
 * Represents errors that occur in the gas price subprovider
 */
export class GasPriceError extends Error {

  public static BlockNotFound(blockNumber: string) {
    const msg = `Could not calculate gas. Block ${blockNumber} was not found`;
    return new GasPriceError(msg, GasPriceErrorCode.BlockNotFound);
  }

  public code: GasPriceErrorCode;

  constructor(message: string, code: GasPriceErrorCode) {
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GasPriceError);
    }
    this.code = code;
  }
}
