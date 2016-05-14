'use strict'
const diff = require('./diff')
const val = require('./val')
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE

module.exports = function (target, subs, update, tree, stamp) {
  if (!tree) { tree = {} }
  target._subscriptions = true
  if (stamp === void 0) {
    stamp = target._lstamp || 0
  }
  if ('val' in subs || 'done' in subs) {
    target.on('subscription', function (data, stamp) {
      val(UPDATE, target, target, subs, update, tree, stamp)
    })
    val(INIT, target, target, subs, update, tree, stamp)
  } else {
    target.on('subscription', function (data, stamp) {
      diff(target, subs, update, tree, stamp)
    })
    diff(target, subs, update, tree, stamp)
  }
  return tree
}
