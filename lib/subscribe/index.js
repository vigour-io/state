'use strict'
const vstamp = require('vigour-stamp')
const diff = require('./diff')

module.exports = function (target, subs, update, tree, stamp) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, stamp) {
    diff(target, subs, update, tree, stamp, tree, subs)
  })
  target._subscriptions = true
  let created
  if (stamp === void 0) {
    stamp = target._lstamp
  }
  if (stamp === void 0) {
    stamp = vstamp.create()
    created = true
  }
  diff(target, subs, update, tree, stamp, tree, subs)
  if (created) { vstamp.close(stamp) }
  return tree
}
