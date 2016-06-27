'use strict'
const struct = require('./struct')
const remove = require('./remove')
module.exports = function test (key, target, subs, update, tree, stamp) {
  const conditionTree = tree[key]
  var passKey
  if (key !== '$test') {
    passKey = '$pass' + key.slice(5)
  } else {
    passKey = '$pass'
  }
  const passTree = tree[passKey]
  const testSubs = '$' in subs && subs.$
  const pass = subs.$pass
  const exec = subs.exec
  const change = testSubs
    ? struct(key, target, testSubs, update, tree, conditionTree, stamp)
    : true

  console.log('YEAH', change)
  if (change) {
    if (exec(target, tree, key)) {
      return struct(passKey, target, pass, update, tree, passTree, stamp)
    } else if (passTree) {
      remove(passKey, target, void 0, pass, update, tree, passTree, stamp)
      return true
    }
  } else if (passTree) {
    return struct(passKey, target, pass, update, tree, passTree, stamp)
  }
}
