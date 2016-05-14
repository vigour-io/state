'use strict'
const diff = require('./diff')
const dictionary = require('./dictionary')
const DONE = dictionary.DONE

module.exports = function val (type, target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, type, stamp, subs, tree)
  }
  diff(target, subs, update, tree, stamp)
  if ('done' in subs) {
    update(target, type, stamp, subs, tree, DONE)
  }
}
