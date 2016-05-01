'use strict'
const subscribe = require('../lib/subscribe')
const s = require('../s')
const isNumber = require('vigour-util/is/number')
const vstamp = require('vigour-stamp')

module.exports = function (t, state, subs) {
  state = state.type === 'state' ? state : s(state)
  var updates = []
  const tree = subscribe(
    state,
    subs,
    function (state, type, stamp, subs, tree, sType) {
      console.log('FIRE SUBS', state.path().join('/'), type, stamp)
      updates.push({
        path: state.path().join('/'),
        type: type,
        tree: tree,
        sType: sType
      })
    }
  )
  var seed = !state._lstamp ? vstamp.cnt : state._lstamp - 1
  return function test (label, updated, testtree, val) {
    if (val) {
      updates = []
      state.set(val)
    }
    const info = updated.length === 0
      ? 'does not fire updates for '
      : 'fires updates for '
    resolveUpdatesTrees(updates, updated, seed)
    resolveSubsTypeChecks(updates, updated)

    t.deepEqual(updates, updated, `${info} "${label}"`)
    if (testtree) {
      testtree = JSON.parse(JSON.stringify(testtree))
      resolveStamps(testtree, seed)
      t.deepEqual(tree, testtree, `"${label}" results in correct tree`)
    }
    return { tree: tree, state: state }
  }
}

function resolveUpdatesTrees (updates, updated, seed) {
  for (let i = 0, len = Math.max(updated.length, updates.length); i < len; i++) {
    if (!updated[i] || !updated[i].tree) {
      if (updates[i]) {
        delete updates[i].tree
      }
    } else if (updated[i] && updated[i].tree && updates[i]) {
      let testtree = JSON.parse(JSON.stringify(updated[i].tree))
      resolveStamps(testtree, seed)
      updates[i].tree = testtree
    }
  }
}

function resolveSubsTypeChecks (updates, updated) {
  for (let i = 0, len = Math.max(updated.length, updates.length); i < len; i++) {
    if (!updated[i] || !updated[i].sType) {
      if (updates[i]) {
        delete updates[i].sType
      }
    }
  }
}

function resolveStamps (tree, seed) {
  for (let key in tree) {
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
