'use strict'
const compute = require('../compute')
const diff = require('../diff')
const dictionary = require('../dictionary')
const remove = require('./remove')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const DONE = dictionary.DONE

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const keyTarget = target && target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp
    let traveltaget
    let ref
    if (keyTarget.val && keyTarget.val._base_version) {
      traveltaget = keyTarget.origin()
      ref = traveltaget
    } else {
      traveltaget = keyTarget
    }

    if (!treeKey) {
      treeKey = tree[key] = {}
      leafStamp = compute(keyTarget, treeKey, stamp, rTree, rSubs, update)
      treeKey.$ = leafStamp

      if (ref) {
        treeKey.$ref = traveltaget
      } else if (tree.$ref) {
        treeKey.$ref = tree.$ref[key]
      }

      treeKey._p = tree
      treeKey.$ = leafStamp
      if (subs.val) {
        update(keyTarget, INIT, stamp, subs, treeKey)
      }
      diff(traveltaget, subs, update, treeKey, stamp, rTree, rSubs, force)
      if (subs.done) {
        update(keyTarget, INIT, stamp, subs, treeKey, DONE)
      }
    } else {
      leafStamp = compute(keyTarget, treeKey, stamp, rTree, rSubs, update)

      if (ref) {
        if (
          treeKey.$ref &&
          treeKey.$ref !== traveltaget
        ) {
          // have to force since they can share the same stamps
          // can also not check here since nested children can have different stamps
          force = true
        }
        treeKey.$ref = traveltaget
      } else if (tree.$ref) {
        treeKey.$ref = tree.$ref[key]
      }

      if ((force || treeKey.$) !== leafStamp) {
        treeKey.$ = leafStamp
        if (subs.val === true) {
          update(keyTarget, UPDATE, stamp, subs, treeKey)
        }
        diff(traveltaget, subs, update, tree[key], stamp, rTree, rSubs, force)
        if (treeKey.$ref && (!ref && keyTarget !== treeKey.$ref)) {
          delete treeKey.$ref
        }
        if (subs.done) {
          update(keyTarget, UPDATE, stamp, subs, treeKey, DONE)
        }
      }
    }
  } else if (treeKey) {
    remove(key, keyTarget, subs, update, tree, treeKey, stamp, rTree, rSubs, force)
  }
}
