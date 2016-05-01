'use strict'
module.exports = function compositeRoot (target, tree, update, stamp, type, rTree, rSubs) {
  var prev
  while (tree && tree !== rTree) {
    if (prev) {
      if (!tree.$c) {
        tree.$c = {}
      }
      if (tree.$c[prev]) {
        if (tree.$c[prev] !== type) {
          tree.$c[prev] = [ tree.$c[prev], type ]
        }
      } else {
        tree.$c[prev] = type
      }
    }
    let key = getKey(tree)
    prev = key
    tree = tree._p
  }
}

function getKey (tree) {
  if (tree._p) {
    for (let key in tree._p) {
      if (tree._p[key] === tree) {
        return key
      }
    }
  }
}
