'use strict'
module.exports = function compositeRoot (target, tree, update, stamp, rTree, rSubs) {
  var prev
  while (tree && tree !== rTree) {
    if (prev) {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[prev] = true
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
