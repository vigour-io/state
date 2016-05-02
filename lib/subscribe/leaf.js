'use strict'
const compute = require('./compute')
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const REMOVE = dictionary.REMOVE
const REMOVEREF = dictionary.REMOVEREF

module.exports = function leaf (key, target, subs, update, tree, stamp, rTree, rSubs, force) {
  var keyTarget = target && target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = compute(keyTarget, treeKey, stamp, rTree, rSubs, update)
    if (!tree[key]) {
      tree[key] = leafStamp
      update(keyTarget, INIT, stamp, subs, tree)
    } else if ((force || treeKey) !== leafStamp) {
      tree[key] = leafStamp
      update(keyTarget, UPDATE, stamp, subs, tree)
    }
  } else if (treeKey) {
    if (!keyTarget && tree.$ref) {
      // make this info a fn
      if (tree.$ref[key]) {
        update(tree.$ref[key], REMOVEREF, stamp, subs, treeKey)
      }
    } else {
      update(keyTarget, REMOVE, stamp, subs, tree)
    }
    delete tree[key]
  }
}
