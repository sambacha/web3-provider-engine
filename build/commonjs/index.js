"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subprovider = void 0;
const provider_engine_1 = __importDefault(require("./provider-engine"));
const subprovider_1 = __importDefault(require("./subprovider"));
exports.Subprovider = subprovider_1.default;
exports.default = provider_engine_1.default;
// Errors
var block_tracker_error_1 = require("./errors/block-tracker-error");
Object.defineProperty(exports, "BlockTrackerError", { enumerable: true, get: function () { return block_tracker_error_1.BlockTrackerError; } });
Object.defineProperty(exports, "BlockTrackerErrorCode", { enumerable: true, get: function () { return block_tracker_error_1.BlockTrackerErrorCode; } });
var gas_price_error_1 = require("./errors/gas-price-error");
Object.defineProperty(exports, "GasPriceError", { enumerable: true, get: function () { return gas_price_error_1.GasPriceError; } });
Object.defineProperty(exports, "GasPriceErrorCode", { enumerable: true, get: function () { return gas_price_error_1.GasPriceErrorCode; } });
var provider_engine_error_1 = require("./errors/provider-engine-error");
Object.defineProperty(exports, "ProviderEngineError", { enumerable: true, get: function () { return provider_engine_error_1.ProviderEngineError; } });
Object.defineProperty(exports, "ProviderEngineErrorCode", { enumerable: true, get: function () { return provider_engine_error_1.ProviderEngineErrorCode; } });
var subscription_error_1 = require("./errors/subscription-error");
Object.defineProperty(exports, "SubscriptionError", { enumerable: true, get: function () { return subscription_error_1.SubscriptionError; } });
Object.defineProperty(exports, "SubscriptionErrorCode", { enumerable: true, get: function () { return subscription_error_1.SubscriptionErrorCode; } });
__exportStar(require("./subproviders/index"), exports);
