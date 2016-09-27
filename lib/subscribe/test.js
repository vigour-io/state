'use strict'
const struct = require('./struct')
const remove = require('./remove')
module.exports = function test (key, target, subs, update, tree, stamp) {
  const conditionTree = tree[key]
  var passKey, c
  if (key !== '$test') {
    passKey = '$pass' + key.slice(5)
  } else {
    passKey = '$pass'
  }
  const passTree = tree[passKey]
  const testSubs = '$' in subs && subs.$
  const pass = subs.$pass
  const exec = subs.exec
  // ok so this will be a bit special
  // needs to be optmized a lot more!
  const change = testSubs
    ? struct(key, target, testSubs, (state, type, subs, stamp, tree) => {
      if (!c) { c = [] }
      c.push(state, type, subs, stamp, tree)
    }, tree, conditionTree, stamp)
    : true

  if (change) {
    if (exec(target, subs, tree, key)) {
      if (c && !passTree) {
        for (let i = 0, len = c.length - 4; i < len; i += 5) {
          update(c[i], c[i + 1], c[i + 2], c[i + 3], c[i + 4])
        }
      }
      return struct(passKey, target, pass, update, tree, passTree, stamp)
    } else if (passTree) {
      if (c) {
        for (let i = 0, len = c.length - 4; i < len; i += 5) {
          update(c[i], c[i + 1], c[i + 2], c[i + 3], c[i + 4])
        }
      }
      remove(passKey, target, void 0, pass, update, tree, passTree, stamp)
      return true
    }
  } else if (passTree) {
    return struct(passKey, target, pass, update, tree, passTree, stamp)
  }
}
