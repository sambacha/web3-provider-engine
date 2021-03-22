"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const create_payload_1 = require("./util/create-payload");
// this is the base class for a subprovider -- mostly helpers
class Subprovider extends events_1.EventEmitter {
    setEngine(engine) {
        this.engine = engine;
        engine.on('block', (block) => (this.currentBlock = block));
        engine.on('start', () => this.start());
        engine.on('stop', () => this.stop());
    }
    emitPayload(payload, cb) {
        this.engine.sendAsync(create_payload_1.createPayload(payload), cb);
    }
    // dummies for overriding
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    start() { }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stop() { }
}
exports.default = Subprovider;
