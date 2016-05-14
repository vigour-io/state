'use strict'
const diff = require('./diff')
const remove = require('./remove')

module.exports = function parent (target, pSubs, subs, update, tree, stamp) {
  var parentTree = tree.$parent
  if(target && target.val !== null) {
    if (!parentTree) {
      parentTree = tree.$parent = { _p: tree, _key: '$parent' }
      addC(tree)
    }
    return diff(target.cParent(), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('$parent', target, subs, update, tree, parentTree, stamp)
    return true
  }
}

function addC (tree) {
  var key = '$parent'
  var parentcounter = 1
  while (tree._p && parentcounter) {
    if (tree._key !== '$parent') {
      if (!tree.$c) {
        tree.$c = {}
      }
      tree.$c[key] = 'parent'
      key = tree._key
      tree = tree._p
      parentcounter--
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}
