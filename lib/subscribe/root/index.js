'use strict'
const composite = require('./composite')
// const compute = require('./compute')
const generateStamp = require('../stamp')
const consts = require('../const') // rename to dictionairy?
const ROOT = consts.ROOT

module.exports = function root (target, pSubs, subs, update, tree, stamp, rTree, rSubs) {
  if (!tree.$r) {
    tree.$r = subs
    const rTarget = target.getRoot()
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
    composite(target, tree, update, stamp, ROOT, rTree, rSubs)
    // compute(target, tree, stamp, rTree, rSubs) <-- check if this is better but seems double...
    tree.$ = generateStamp(target, tree, stamp, rTree, rSubs, update, true)
  }
}
