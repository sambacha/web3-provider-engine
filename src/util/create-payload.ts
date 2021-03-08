import extend from 'xtend';
import { createRandomId } from './random-id';

export function createPayload(data) {
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data);
}
