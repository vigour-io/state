'use strict'
const computeRoot = require('./root/compute')
module.exports = function compute (target, tree, stamp, rTree, update, force) {
  var lstamp = target._lstamp || 0
  if (tree) {
    if (tree.$root) {
      const rstamp = computeRoot(target, tree, stamp, rTree, void 0, update, force)
      if (rstamp) {
        tree.$root.$ = rstamp
        lstamp += rstamp
      }
    }
    // make tests for FORCE for nested root updates may be nessecary...
    let cstamp = computeComposite(target, tree, stamp, rTree, update)
    if (cstamp) {
      lstamp += cstamp
    }
  }
  return lstamp
}

function computeComposite (target, tree, stamp, rTree, update) {
  if (tree.$c) {
    if (tree.$c.$ !== stamp) {
      let istamp
      tree.$c.$ = stamp
      for (let key in tree.$c) {
        if (key !== '$' && key !== '$$') {
          let cTree = tree[key]
          if (cTree.$root) {
            // wrong need key on target...
            // calculate and FIRE the root updates
            istamp = computeRoot(target, cTree, stamp, rTree, istamp, update)
          }
          if (tree[key].$c) {
            let cStamp = computeComposite(target[key], tree[key], stamp, rTree, update)
            if (cStamp) {
              stamp += cStamp
            }
          }
        }
      }
      if (tree.$c.$ !== stamp) {
        tree.$c.$$ = stamp
      }
      return stamp
    } else {
      return tree.$c.$$ || tree.$c.$
    }
  }
}
