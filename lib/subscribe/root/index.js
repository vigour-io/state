'use strict'
const composite = require('./composite')
const compute = require('../compute')

function copy (subs, top) {
  const n = {}
  if (typeof subs === 'object') {
    for (let i in subs) {
      if (i !== '_' && i !== '$' && i !== 'val') {
        if (top && subs[i] === true) {
          subs[i] = { val: true }
        }
        n[i] = copy(subs[i])
      } else {
        n[i] = subs[i]
      }
    }
  } else {
    return subs
  }
  return n
}

module.exports = function root (target, pSubs, subs, update, tree, stamp, rTree, rSubs) {
  if (!tree.$root) {
    tree.$root = copy(subs, true)
    composite(target, tree, update, stamp, rTree, rSubs)
    tree.$ = compute(target, tree, stamp, rTree, rSubs, update, true)
  }
}
