"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayload = void 0;
const xtend_1 = __importDefault(require("xtend"));
const random_id_1 = require("./random-id");
function createPayload(data) {
    return xtend_1.default({
        // defaults
        id: random_id_1.createRandomId(),
        jsonrpc: '2.0',
        params: [],
    }, data);
}
exports.createPayload = createPayload;
