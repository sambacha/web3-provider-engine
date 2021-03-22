"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGas = void 0;
const create_payload_js_1 = require("./create-payload.js");
/*

This is a work around for https://github.com/ethereum/go-ethereum/issues/2577

*/
function estimateGas(provider, txParams, cb) {
    provider.sendAsync(create_payload_js_1.createPayload({
        method: 'eth_estimateGas',
        params: [txParams],
    }), (err, res) => {
        if (err) {
            // handle simple value transfer case
            if (err.message === 'no contract code at given address') {
                return cb(null, '0xcf08');
            }
            else {
                return cb(err);
            }
        }
        cb(null, res.result);
    });
}
exports.estimateGas = estimateGas;
