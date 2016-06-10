'use strict'
const diff = require('../diff')
const remove = require('../remove')
// const composite = require('./composite')

module.exports = function parent (target, subs, update, tree, stamp) {
  console.log('parent')
  var parentTree = tree.parent
  if (target && target.val !== null) {
    if (!parentTree) {
      parentTree = tree.parent = { _p: tree, _key: 'parent' }
      composite(tree, 'parent')
    }
    console.log('diff it')
    return diff(target.cParent(), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('parent', target, target, subs, update, tree, parentTree, stamp)
    return true
  }
}

function composite (tree, type) {
  var key = type
  var parentcounter = 1
  // parentcounter -- ultra inefficient ofc -- but good temp fix -- this is the last thing
  // making sure reapplying / applying the $c works as expected -- this can be hard in cases of references
  // references have to resolve $c until the first common ancesotr ---
  while (tree._p) {
    if (tree._key !== type) {
      // add both! -- difficult to combine
      // have to do
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = type
      key = tree._key
      tree = tree._p
      if (key !== '$any') {
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}
