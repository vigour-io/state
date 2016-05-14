'use strict'
const diff = require('./diff')
const val = require('./val')
const valUpdate = val.update
const valCreate = val.create

module.exports = function (target, subs, update, tree, stamp) {
  if (!tree) { tree = {} }
  target._subscriptions = true
  if (stamp === void 0) {
    stamp = target._lstamp || 0
  }
  if ('val' in subs || 'done' in subs) {
    target.on('subscription', function (data, stamp) {
      valUpdate(target, target, subs, update, tree, stamp)
    })
    valCreate(target, target, subs, update, tree, stamp)
  } else {
    target.on('subscription', function (data, stamp) {
      diff(target, subs, update, tree, stamp)
    })
    diff(target, subs, update, tree, stamp)
  }
  return tree
}
