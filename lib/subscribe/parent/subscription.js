'use strict'
const diff = require('../diff')
const remove = require('../remove')

module.exports = function parent (target, subs, update, tree, stamp) {
  var parentTree = tree.$parent
  if (target && target.val !== null) {
    if (!parentTree) {
      parentTree = tree.$parent = { _p: tree, _key: '$parent' }
      composite(tree, '$parent')
    }
    return diff(get(target, tree), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('$parent', target, target, subs, update, tree, parentTree, stamp)
    return true
  }
}

function get (target, tree) {
  const path = []
  var key = '$parent'
  var parentcounter = 1
  while (tree._p) {
    if (tree._key !== '$parent') {
      key = tree._key
      tree = tree._p
      if (key === '$root') {
        path.unshift('getRoot')
      } else if (key[0] !== '$') { // && !parent...
        parentcounter--
        if (parentcounter < 0) {
          path.unshift(key)
        }
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
  return (!path.length) ? target.getRoot() : target.getRoot().get(path)
}

function composite (tree, type) {
  var key = type
  var parentcounter = 1
  while (tree._p && parentcounter) {
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
