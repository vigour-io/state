'use strict'
const diff = require('../diff')
const remove = require('../remove')
const composite = require('./composite')

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

