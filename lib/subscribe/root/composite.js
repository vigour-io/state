'use strict'
module.exports = function compositeRoot (target, tree, update, stamp, rTree, rSubs) {
  var prev
  while (tree && tree !== rTree) {
    if (prev) {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[prev] = true
    }
    prev = tree._key
    tree = tree._p
  }
}
