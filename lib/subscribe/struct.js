'use strict'
const generateStamp = require('./stamp')
const consts = require('./const')
const INIT = consts.INIT
const UPDATE = consts.UPDATE
const REMOVE = consts.REMOVE
const diff = require('./diff')

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp
    if (!treeKey) {
      treeKey = tree[key] = {}
      leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs, update)
      treeKey.$ = leafStamp
      if (rTree.parent) {
        treeKey._parent = tree
      }
      // -----------------------------
      treeKey.$ = leafStamp
      if ((subs.val) && update) {
        update(keyTarget, INIT, stamp, subs, treeKey)
      }
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    } else {
      leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs, update)
      if ((force || treeKey.$) !== leafStamp) {
        treeKey.$ = leafStamp
        if (subs.val === true) {
          update(keyTarget, UPDATE, stamp, subs, treeKey)
        }
        diff(keyTarget, subs, update, tree[key], stamp, rTree, rSubs, force)
      }
    }
  } else if (treeKey) {
    if (keyTarget && keyTarget.val === null) {
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    }
    if (subs.val) {
      update(keyTarget, REMOVE, stamp, subs, treeKey)
    }
    if (tree.$c && tree.$c[key]) {
      delete tree.$c[key]
    }
    delete tree[key]
  }
}
