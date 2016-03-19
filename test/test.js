'use strict'
var subscribe = require('../lib/subscribe')

module.exports = function (t, state, subs) {
  var updates = []
  var tree = subscribe(
    state,
    subs,
    function (type, event) {
      updates.push({ path: this.path.join('/'), type: type })
    }
  )
  return function test (label, updated, testtree, val) {
    if (val) {
      updates = []
      state.set(val)
    }
    t.deepEqual(
      updates,
      updated,
      'fires updates for ' + label
    )
    t.deepEqual(tree, testtree, label + ' results in correct tree')
  }
}
