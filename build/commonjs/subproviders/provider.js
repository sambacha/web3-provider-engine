"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_rpc_error_1 = __importDefault(require("json-rpc-error"));
const subprovider_1 = __importDefault(require("../subprovider"));
// wraps a provider in a subprovider interface
class ProviderSubprovider extends subprovider_1.default {
    constructor(provider) {
        super();
        this.provider = provider;
    }
    handleRequest(payload, next, end) {
        this.provider.sendAsync(payload, (err, response) => {
            if (err) {
                return end(err);
            }
            if (response.error) {
                return end(new json_rpc_error_1.default.InternalError(response.error));
            }
            end(null, response.result);
        });
    }
}
exports.default = ProviderSubprovider;
