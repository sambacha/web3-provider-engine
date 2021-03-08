export enum ProviderEngineErrorCode {
  UnhandledRequest = 1000,
  MissingImplementation = 1001,
  UnsupportedFeature = 1002,
}

/**
 * Represents errors specific to ProviderEngine
 */
export class ProviderEngineError extends Error {

  public code: ProviderEngineErrorCode;

  constructor(message: string, code: ProviderEngineErrorCode) {
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProviderEngineError);
    }
    this.code = code;
  }
}
