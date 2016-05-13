'use strict'
const diff = require('./diff')
const remove = require('./struct/remove')

module.exports = function parent (target, pSubs, subs, update, tree, stamp) {
  var parentTree = tree.$parent
  console.log('its parent!')
  if(target && target.val !== null) {
    if (!parentTree) {
      console.log('MAKE PARENT')
      parentTree = tree.$parent = { _p: tree, _key: '$root' }
      addC(tree)
    }
    diff(target.cParent(), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('$parent', target, subs, update, tree, parentTree, stamp)
  }
}

function addC (tree) {
  // only as high as the parent
  console.log('add C!')
  // parent parent parent need to support
  var key = '$parent'
  if (!tree.$c) {
    tree.$c = {}
  }
  tree.$c[key] = 'parent'
  // key = tree._key
  // tree = tree._p
}
