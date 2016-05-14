'use strict'
const diff = require('./diff')
const struct = require('./struct')
const remove = require('./remove')

module.exports = function condition (target, pSubs, subs, update, tree, stamp) {
  const conditionSubs = subs.$subs
  const pass = subs.$pass
  const method = subs.val
  var conditionTree = tree.$condition
  var passTree = tree.$pass
  if (!conditionTree) {
    conditionTree = tree.$condition = { _p: tree, _key: '$condition' }
  }
  const change = diff(target, conditionSubs, update, conditionTree, stamp)
  if (change && method(target)) {
    return struct('$pass', target, subs, pass, update, tree, passTree, stamp)
  } else if (passTree) {
    remove('$pass', target, void 0, pass, update, tree, passTree, stamp)
    return true
  }
}
