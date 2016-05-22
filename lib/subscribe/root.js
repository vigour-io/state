'use strict'
const diff = require('./diff')
const removeComposite = require('./remove/composite')

module.exports = function root (target, subs, update, tree, stamp) {
  var rootTree = '$root' in tree && tree.$root
  if (target && (!('val' in target) || target.val !== null)) {
    if (!rootTree) {
      rootTree = tree.$root = { _key: '$root', _p: tree }
      addC(tree)
    }
    return diff(target.getRoot(), subs, update, rootTree, stamp)
  } else if ('$remove' in subs) {
    diff(target, subs, update, rootTree, stamp)
    removeComposite(tree, '$root')
    delete tree.$root
    return true
  }
}

function addC (tree) {
  var key = '$root'
  while (
    '_p' in tree &&
    (!('$c' in tree) ||
    !(key in tree.$c) ||
    tree.$c[key] !== 'root')
  ) {
    if (!('$c' in tree)) { tree.$c = {} }
    tree.$c[key] = 'root'
    key = tree._key
    tree = tree._p
  }
}
