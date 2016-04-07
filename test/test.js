'use strict'
var subscribe = require('../lib/subscribe')
var s = require('../s')

module.exports = function (t, state, subs) {
  state = state.type === 'state' ? state : s(state)
  var updates = []
  var tree = subscribe(
    state,
    subs,
    function (type, event) {
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
      'fires updates for ' + label
    )
    resolveStamps(testtree, seed)
    t.deepEqual(tree, testtree, label + ' results in correct tree')
    // console.log('tree:', JSON.stringify(tree, false, 2))
  }
}

function resolveStamps (tree, seed) {
  for (var key in tree) {
    if (typeof tree[key] === 'object' && key !== '$') {
      resolveStamps(tree[key], seed)
    } else if (key !== 'val') {
      if (tree[key] instanceof Array) {
        let val = 0
        for (let i in tree[key]) {
          val += (tree[key][i] + seed)
        }
        tree[key] = val
      } else if (tree[key] !== true) {
        tree[key] = tree[key] + seed
      }
    }
  }
}
