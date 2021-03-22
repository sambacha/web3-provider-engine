"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionError = exports.SubscriptionErrorCode = void 0;
var SubscriptionErrorCode;
(function (SubscriptionErrorCode) {
    SubscriptionErrorCode[SubscriptionErrorCode["UnsupportedType"] = 2000] = "UnsupportedType";
    SubscriptionErrorCode[SubscriptionErrorCode["NotFound"] = 2001] = "NotFound";
})(SubscriptionErrorCode = exports.SubscriptionErrorCode || (exports.SubscriptionErrorCode = {}));
/**
 * Represents an error that occurs in the subscriptions subprovider
 */
class SubscriptionError extends Error {
    constructor(message, code) {
        super(message);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SubscriptionError);
        }
        this.code = code;
    }
    static UnsupportedType(type) {
        return new SubscriptionError(`Unsupported subscription type: ${type}`, SubscriptionErrorCode.UnsupportedType);
    }
    static NotFound(subscriptionId) {
        return new SubscriptionError(`Subscription with id ${subscriptionId} not found`, SubscriptionErrorCode.NotFound);
    }
}
exports.SubscriptionError = SubscriptionError;
