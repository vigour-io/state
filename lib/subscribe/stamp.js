'use strict'
const computeRoot = require('./root/compute')

module.exports = function generateStamp (target, tree, stamp, rTree, rSubs, update) {
  var lstamp = target._lstamp
  if (tree) {
    if (tree.$r) {
      // calculate and FIRE the root updates
      const rstamp = computeRoot(target, tree, stamp, rTree, rSubs, void 0, update)
      if (rstamp) {
        tree.$r.$ = rstamp
        lstamp += rstamp
      }
    }
    let cstamp = computeComposite(target, tree, stamp, rTree, rSubs, update)
    if (cstamp) {
      lstamp += cstamp
    }
  }
  return lstamp
}

function computeComposite (target, tree, stamp, rTree, rSubs, update) {
  if (tree.$c) {
    if (tree.$c.$ !== stamp) {
      let istamp
      tree.$c.$ = stamp
      for (let key in tree.$c) {
        if (key !== '$' && key !== '$$') {
          let cTree = tree[key]
          if (cTree.$r) {
            // calculate and FIRE the root updates
            istamp = computeRoot(target, cTree, stamp, rTree, rSubs, istamp, update)
          }
          if (tree[key].$c) {
            let cStamp = computeComposite(target[key], tree[key], stamp, rTree, rSubs, update)
            if (cStamp) {
              if (!stamp) {
                stamp = cStamp
              } else {
                stamp += cStamp
              }
            }
          }
        }
      }
      if (tree.$c.$ !== stamp) {
        tree.$c.$$ = stamp
      } else if (tree.$c.$$) {
        tree.$c.$$ = void 0
      }
      return stamp
    } else {
      return tree.$c.$$ || tree.$c.$
    }
  }
}
