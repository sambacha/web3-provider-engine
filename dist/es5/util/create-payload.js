"use strict";

var getRandomId = require('./random-id.js');

var extend = require('xtend');

module.exports = createPayload;

function createPayload(data) {
  return extend({
    // defaults
    id: getRandomId(),
    jsonrpc: '2.0',
    params: [] // user-specified

  }, data);
}