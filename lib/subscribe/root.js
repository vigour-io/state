'use strict'
const diff = require('./diff')
const remove = require('./remove')

module.exports = function root (target, pSubs, subs, update, tree, stamp) {
  var rootTree = tree.$root
  if(target && target.val !== null) {
    if (!rootTree) {
      rootTree = tree.$root = { _p: tree, _key: '$root' }
      addC(tree)
    }
    diff(target.getRoot(), subs, update, rootTree, stamp)
  } else if (rootTree && '$remove' in subs) {
    remove('$root', target, subs, update, tree, rootTree, stamp)
  }
}

function addC (tree) {
  var key = '$root'
  while (tree._p && (!tree.$c || !tree.$c[key] || tree.$c[key] !== 'root')) {
    if (!tree.$c) { tree.$c = {} }
    tree.$c[key] = 'root'
    key = tree._key
    tree = tree._p
  }
}
