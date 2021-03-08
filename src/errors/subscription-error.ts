export enum SubscriptionErrorCode {
  UnsupportedType = 2000,
  NotFound = 2001,
}

/**
 * Represents an error that occurs in the subscriptions subprovider
 */
export class SubscriptionError extends Error {

  public static UnsupportedType(type: string) {
    return new SubscriptionError(`Unsupported subscription type: ${type}`, SubscriptionErrorCode.UnsupportedType);
  }

  public static NotFound(subscriptionId: string) {
    return new SubscriptionError(`Subscription with id ${subscriptionId} not found`, SubscriptionErrorCode.NotFound);
  }

  public code: SubscriptionErrorCode;

  constructor(message: string, code: SubscriptionErrorCode) {
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SubscriptionError);
    }
    this.code = code;
  }
}
