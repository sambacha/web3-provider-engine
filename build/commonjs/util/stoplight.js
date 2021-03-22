"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Stoplight extends events_1.EventEmitter {
    constructor() {
        super();
        this.isLocked = true;
    }
    go() {
        this.isLocked = false;
        this.emit('unlock');
    }
    stop() {
        this.isLocked = true;
        this.emit('lock');
    }
    await(fn) {
        if (this.isLocked) {
            this.once('unlock', fn);
        }
        else {
            setTimeout(fn);
        }
    }
}
exports.default = Stoplight;
