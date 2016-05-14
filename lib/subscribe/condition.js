'use strict'
const struct = require('./struct')
const remove = require('./remove')
module.exports = function condition (target, pSubs, subs, update, tree, stamp) {
  const conditionTree = tree.$condition
  const passTree = tree.$pass
  const conditionSubs = subs.$subs
  const pass = subs.$pass
  const method = subs.val
  const change = struct('$condition', target, subs, conditionSubs, update, tree, conditionTree, stamp)
  if (change) {
    if (method(target)) {
      return struct('$pass', target, subs, pass, update, tree, passTree, stamp)
    } else if (passTree) {
      remove('$pass', target, void 0, pass, update, tree, passTree, stamp)
      return true
    }
  }
}
