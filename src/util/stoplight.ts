import { EventEmitter } from 'events';

export default class Stoplight extends EventEmitter {
  public isLocked: boolean;

  constructor() {
    super();
    this.isLocked = true;
  }

  public go() {
    this.isLocked = false;
    this.emit('unlock');
  }

  public stop() {
    this.isLocked = true;
    this.emit('lock');
  }

  public await(fn) {
    if (this.isLocked) {
      this.once('unlock', fn);
    } else {
      setTimeout(fn);
    }
  }
}
