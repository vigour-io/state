'use strict'
var subscribe = require('../lib/subscribe')
var s = require('../s')
var isNumber = require('vigour-util/is/number')

module.exports = function (t, state, subs) {
  state = state.type === 'state' ? state : s(state)
  var updates = []
  var tree = subscribe(
    state,
    subs,
    function (type, stamp) {
      updates.push({ path: this.path().join('/'), type: type })
    }
  )
  var seed = state._lstamp - 1
  return function test (label, updated, testtree, val) {
    if (val) {
      updates = []
      state.set(val)
    }
    t.deepEqual(
      updates,
      updated,
      (updated.length === 0 ? 'does not fire updates for ' : 'fires updates for ') + '"' + label + '"'
    )
    if (testtree) {
      testtree = JSON.parse(JSON.stringify(testtree))
      resolveStamps(testtree, seed)
      t.deepEqual(tree, testtree, '"' + label + '" results in correct tree')
    }
  }
}

function resolveStamps (tree, seed) {
  for (var key in tree) {
    if (typeof tree[key] === 'object' && key !== '$' && key !== '$$') {
      resolveStamps(tree[key], seed)
    } else if (key !== 'val') {
      if (tree[key] instanceof Array) {
        let val = 0
        for (let i in tree[key]) {
          val += (tree[key][i] + seed)
        }
        tree[key] = val
      } else if (isNumber(tree[key])) {
        tree[key] = tree[key] + seed
      }
    }
  }
}
