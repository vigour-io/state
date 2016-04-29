'use strict'
var subscribe = require('../lib/subscribe')
var s = require('../s')
var isNumber = require('vigour-util/is/number')
var vstamp = require('vigour-stamp')

module.exports = function (t, state, subs) {
  state = state.type === 'state' ? state : s(state)
  var updates = []
  var tree = subscribe(
    state,
    subs,
    function (state, type, stamp, subs, tree) {
      updates.push({ path: state.path().join('/'), type: type })
    }
  )
  var seed = !state._lstamp ? vstamp.cnt : state._lstamp - 1
  return function test (label, updated, testtree, val) {
    if (val) {
      updates = []
      state.set(val)
    }
    const info = (updated.length === 0 ? 'does not fire updates for ' : 'fires updates for ')
    t.deepEqual(
      updates,
      updated,
      `${info} "${label}"`
    )
    if (testtree) {
      testtree = JSON.parse(JSON.stringify(testtree))
      resolveStamps(testtree, seed)
      t.deepEqual(tree, testtree, '"' + label + '" results in correct tree')
    }
    return { tree: tree, state: state }
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
