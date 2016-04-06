'use strict'
var State = require('./')
module.exports = function s (val, stamp) {
  return new State(val, stamp)
}
