'use strict'
const diff = require('./diff')
const remove = require('./remove')

module.exports = function parent (target, subs, update, tree, stamp) {
  var parentTree = tree.$parent
  if (target && target.val !== null) {
    if (!parentTree) {
      parentTree = tree.$parent = { _p: tree, _key: '$parent' }
      addC(tree)
    }
    // here we need to walk the tree not the parent
    return diff(get(target, tree), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('$parent', target, target, subs, update, tree, parentTree, stamp)
    return true
  }
}

function get (target, tree) {
  var path = []
  tree = tree._p
  while (tree && tree._key) {
    if (tree._key[0] !== '$') {
      path.unshift(tree._key)
    }
    tree = tree._p
  }
  const r = target.getRoot()
  // how to handle any??? -- just skip easy
  console.log('here we go!', path, target.path())
  return r.get(path)
}

function addC (tree) {
  var key = '$parent'
  var parentcounter = 1
  while (tree._p && parentcounter) {
    if (tree._key !== '$parent') {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = 'parent'
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
