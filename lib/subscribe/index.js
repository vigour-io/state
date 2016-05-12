'use strict'
const diff = require('./diff')

module.exports = function (target, subs, update, tree, stamp) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, stamp) {
    diff(target, subs, update, tree, stamp, tree)
  })
  target._subscriptions = true
  if (stamp === void 0) {
    stamp = target._lstamp || 0
  }
  diff(target, subs, update, tree, stamp, tree)
  return tree
}
