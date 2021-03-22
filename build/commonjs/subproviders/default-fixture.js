"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xtend_1 = __importDefault(require("xtend"));
const fixture_1 = __importDefault(require("./fixture"));
class DefaultFixtures extends fixture_1.default {
    constructor(opts) {
        opts = opts || {};
        const responses = xtend_1.default({
            web3_clientVersion: 'ProviderEngine' + '/javascript',
            net_listening: true,
            eth_hashrate: '0x00',
            eth_mining: false,
        }, opts);
        super(responses);
    }
}
exports.default = DefaultFixtures;
