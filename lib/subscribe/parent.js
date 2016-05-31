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
    return diff(get(target, parentTree, subs), subs, update, parentTree, stamp)
  } else if (parentTree && '$remove' in subs) {
    remove('$parent', target, target, subs, update, tree, parentTree, stamp)
    return true
  }
}

function get (target, tree, subs) {
  var path = []
  var rpath = []
  tree = tree._p

  // console.log('go get it!', tree._key, subs)

  while (tree && tree._key) {
    if (tree._key[0] !== '$') {
      path.unshift(tree._key)
    } else if (tree._key === '$parent') {
      tree = tree._p
    }
    rpath.unshift(tree._key)
    tree = tree._p
  }
  const r = target.getRoot()
  path.pop()
  // how to handle any??? -- just skip easy
  console.log('here we go!', path, target.path(), rpath)
  // now we want the second parent to fire
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
