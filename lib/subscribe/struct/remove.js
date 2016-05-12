'use strict'
const diff = require('../diff')
const dictionary = require('../dictionary')
const REMOVE = dictionary.REMOVE
const DONE = dictionary.DONE
const REMOVEREF = dictionary.REMOVEREF

module.exports = function structRemove (key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force) {
  if (keyTarget && keyTarget.val === null) {
    if ('$remove' in subs) {
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    }
    if ('val' in subs) {
      update(keyTarget, REMOVE, stamp, subs, treeKey)
    }
    if ('done' in subs) {
      update(keyTarget, REMOVE, stamp, subs, treeKey, DONE)
    }
  } else if ('$ref' in tree) {
    removeReference(key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force)
  }
  if ('$c' in tree && tree.$c[key]) {
    delete tree.$c[key]
  }
  delete tree[key]
}

function removeReference (key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force) {
  if ('$remove' in subs) {
    diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
  }
  if ('val' in subs) {
    update(tree.$ref[key], REMOVEREF, stamp, subs, treeKey)
  }
  if ('done' in subs) {
    update(tree.$ref[key], REMOVEREF, stamp, subs, treeKey, DONE)
  }
}
