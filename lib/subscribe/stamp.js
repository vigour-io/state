'use strict'
const computeRoot = require('./root/compute')

module.exports = function generateStamp (target, tree, stamp, rTree, rSubs) {
  var lstamp = target._lstamp
  if (tree) {
    if (tree.$r && tree.$r.$) {
      lstamp += tree.$r.$
    }
    let cstamp = computeComposite(target, tree, stamp, rTree, rSubs)
    if (cstamp) {
      lstamp += cstamp
    }
  }
  return lstamp
}

function computeComposite (target, tree, stamp, rTree, rSubs) {
  if (tree.$c) {
    if (tree.$c.$ !== stamp) {
      let istamp
      tree.$c.$ = stamp
      for (let key in tree.$c) {
        if (key !== '$' && key !== '$$') {
          let cTree = tree[key]
          if (cTree.$r) {
            istamp = computeRoot(target, cTree, stamp, rTree, rSubs, istamp)
          }
          if (tree[key].$c) {
            let cStamp = computeComposite(target[key], tree[key], stamp, rTree, rSubs)
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
