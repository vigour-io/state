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
  const path = []
  var key = '$parent'
  var parentcounter = 1
  while (tree._p) {
    if (tree._key !== '$parent') {
      key = tree._key
      tree = tree._p

      if (key[0] !== '$') {
        parentcounter--
        // if(key == '$')
        // key any is a problem
        if (parentcounter < 0) {
          path.unshift(key)
        }
      }
      // }
      // }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
  console.log('parent:', path, target.path())
  // can be greatly optmized
  return target.getRoot().get(path)
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
      // if (key[0] !== '$') { do this

      // any key can be ignored here i geuss...not nessecary????
      // switch / test
      if (key[0] === '$') {
        console.log('parent hmm may need ot handle this $c thing here', key)
      }

      if (key !== '$any') { // was !== $any
        parentcounter--
      }
    } else {
      // handle the key in the else
      parentcounter++
      tree = tree._p
    }
  }
}
