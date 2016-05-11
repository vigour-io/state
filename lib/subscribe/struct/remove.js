'use strict'
const diff = require('../diff')
const dictionary = require('../dictionary')
const REMOVE = dictionary.REMOVE
const DONE = dictionary.DONE
const REMOVEREF = dictionary.REMOVEREF

module.exports = function structRemove (key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force) {
  console.log('remove????', key)
  if (keyTarget && keyTarget.val === null) {
    console.log('ok so wtf', key)
    if ('$remove' in subs) {
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    }
    if (subs.val) {
      update(keyTarget, REMOVE, stamp, subs, treeKey)
    }
    if (subs.done) {
      update(keyTarget, REMOVE, stamp, subs, treeKey, DONE)
    }
  } else if (tree.$ref) {
    removeReference(key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force)
  }
  if (tree.$c && tree.$c[key]) {
    delete tree.$c[key]
  }
  delete tree[key]
}

function removeReference (key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force) {
  diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
  if (subs.val) {
    update(tree.$ref[key], REMOVEREF, stamp, subs, treeKey)
  }
  if (subs.done) {
    update(tree.$ref[key], REMOVEREF, stamp, subs, treeKey, DONE)
  }
}
