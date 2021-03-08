import { EventEmitter } from 'events';

export default abstract class Filter extends EventEmitter {
  public abstract update(logs): void;
  public abstract getChanges(): any[];
  public abstract clearChanges(): void;
}
