'use strict'
const composite = require('./composite')
const generateStamp = require('../stamp')
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
    // only need to do this once
    for (let key in subs) {
      let rTreeTarget = rTree[key]
      if (rTarget[key]) {
        let rSubsKey = subs[key]
        if (rSubsKey === true && key !== 'val') {
          rSubsKey = subs[key] = { val: true }
        }
        if (!rTreeTarget) {
          rTreeTarget = rTree[key] = {}
        }
      }
    }
    // super innefficent ofcourse
    tree.$r = copy(subs)
    // want ot reuse as much as possibl make an optmization for this later
    composite(target, tree, update, stamp, ROOT, rTree, rSubs)
    tree.$ = generateStamp(target, tree, stamp, rTree, rSubs, update, true)
  }
}
