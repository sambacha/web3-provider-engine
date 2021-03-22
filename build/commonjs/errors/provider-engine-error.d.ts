export declare enum ProviderEngineErrorCode {
    UnhandledRequest = 1000,
    MissingImplementation = 1001,
    UnsupportedFeature = 1002
}
/**
 * Represents errors specific to ProviderEngine
 */
export declare class ProviderEngineError extends Error {
    code: ProviderEngineErrorCode;
    constructor(message: string, code: ProviderEngineErrorCode);
}
