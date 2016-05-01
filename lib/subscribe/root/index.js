'use strict'
const composite = require('./composite')
const compute = require('../compute')
const consts = require('../const') // rename to dictionairy?
const ROOT = consts.ROOT

function copy (subs) {
  const n = {}
  if (typeof subs === 'object') {
    for (let i in subs) {
      if (i !== '_' && i !== '$') {
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
  if (!tree.$r) {
    const rTarget = target.getRoot()

    // ---------------------------------------------
    // only need to do this once do it in copy...
    for (let key in subs) {
      if (rTarget[key]) {
        let rSubsKey = subs[key]
        if (rSubsKey === true && key !== 'val') {
          rSubsKey = subs[key] = { val: true }
        }
      }
    }
    // ---------------------------------------------

    tree.$r = copy(subs)
    composite(target, tree, update, stamp, ROOT, rTree, rSubs)
    tree.$ = compute(target, tree, stamp, rTree, rSubs, update, true)
  }
}
