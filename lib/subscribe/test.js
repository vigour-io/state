'use strict'
const struct = require('./struct')
const remove = require('./remove')
module.exports = function test (target, subs, update, tree, stamp) {
  const conditionTree = tree.$test
  const passTree = tree.$pass
  const testSubs = '$' in subs && subs.$
  const pass = subs.$pass
  const exec = subs.exec
  const change = testSubs
    ? struct('$test', target, testSubs, update, tree, conditionTree, stamp)
    : true
  if (change) {
    if (exec(target)) {
      return struct('$pass', target, pass, update, tree, passTree, stamp)
    } else if (passTree) {
      remove('$pass', target, void 0, pass, update, tree, passTree, stamp)
      return true
    }
  } else if (passTree) {
    return struct('$pass', target, pass, update, tree, passTree, stamp)
  }
}
