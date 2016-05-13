'use strict'
const diff = require('./diff')

module.exports = function root (target, pSubs, subs, update, tree, stamp) {
  console.log('lullzors', subs)
  var rootTree = tree.$root
  if (!rootTree) {
    rootTree = tree.$root = { _p: tree, _key: '$root' }
    console.log('make root!')
    addC(tree)
  }
  // now just check if its removal
  diff(target.getRoot(), subs, update, rootTree, stamp)
}

// for parent you only need to addC till the parent (bit different...)

function addC (tree) {
  var key = '$root'
  while (tree._p) {
    if (!tree.$c) {
      tree.$c = {}
    }
    tree.$c[key] = 'root'
    key = tree._key
    tree = tree._p
  }
}
