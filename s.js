'use strict'
var State = require('./')
module.exports = function s (val, event) {
  return new State(val, event)
}
