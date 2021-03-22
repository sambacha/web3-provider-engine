"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subprovider_1 = __importDefault(require("../subprovider"));
class FixtureProvider extends subprovider_1.default {
    constructor(staticResponses) {
        super();
        this.staticResponses = staticResponses || {};
    }
    handleRequest(payload, next, end) {
        const staticResponse = this.staticResponses[payload.method];
        // async function
        if ('function' === typeof staticResponse) {
            staticResponse(payload, next, end);
            // static response - null is valid response
        }
        else if (staticResponse !== undefined) {
            // return result asynchronously
            setTimeout(() => end(null, staticResponse));
            // no prepared response - skip
        }
        else {
            next();
        }
    }
}
exports.default = FixtureProvider;
