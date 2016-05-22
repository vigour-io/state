'use strict'
const struct = require('./struct')
const remove = require('./remove')
module.exports = function condition (target, subs, update, tree, stamp) {
  const conditionTree = tree.$condition
  const passTree = tree.$pass
  const conditionSubs = subs.$subs
  const pass = subs.$pass
  const method = subs.exec
  const change = struct('$test', target, conditionSubs, update, tree, conditionTree, stamp)
  if (change) {
    if (method(target)) {
      return struct('$pass', target, pass, update, tree, passTree, stamp)
    } else if (passTree) {
      remove('$pass', target, void 0, pass, update, tree, passTree, stamp)
      return true
    }
  } else if (passTree) {
    return struct('$pass', target, pass, update, tree, passTree, stamp)
  }
}
