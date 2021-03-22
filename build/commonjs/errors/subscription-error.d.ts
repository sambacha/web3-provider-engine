export declare enum SubscriptionErrorCode {
    UnsupportedType = 2000,
    NotFound = 2001
}
/**
 * Represents an error that occurs in the subscriptions subprovider
 */
export declare class SubscriptionError extends Error {
    static UnsupportedType(type: string): SubscriptionError;
    static NotFound(subscriptionId: string): SubscriptionError;
    code: SubscriptionErrorCode;
    constructor(message: string, code: SubscriptionErrorCode);
}
