export declare enum GasPriceErrorCode {
    BlockNotFound = 4000
}
/**
 * Represents errors that occur in the gas price subprovider
 */
export declare class GasPriceError extends Error {
    static BlockNotFound(blockNumber: string): GasPriceError;
    code: GasPriceErrorCode;
    constructor(message: string, code: GasPriceErrorCode);
}
