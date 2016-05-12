'use strict'
const compute = require('../compute')
const diff = require('../diff')
const dictionary = require('../dictionary')
const remove = require('./remove')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const DONE = dictionary.DONE
const perf = require('vigour-performance')
module.exports = function struct (key, target, pSubs, subs, update, tree, stamp, rTree, force) {
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
      treeKey = tree[key] = { _p: tree, _key: key }
      leafStamp = compute(keyTarget, treeKey, stamp, rTree, update)
      treeKey.$ = leafStamp
      if (ref) {
        treeKey.$ref = traveltaget
      } else if ('$ref' in tree && '$remove' in subs) {
        treeKey.$ref = tree.$ref[key]
      }
      treeKey.$ = leafStamp
      if ('val' in subs) {
        update(keyTarget, INIT, stamp, subs, treeKey)
      }
      diff(traveltaget, subs, update, treeKey, stamp, rTree, force)
      if ('done' in subs) {
        update(keyTarget, INIT, stamp, subs, treeKey, DONE)
      }
    } else {
      leafStamp = compute(keyTarget, treeKey, stamp, rTree, update)
      if (ref) {
        if (
          '$ref' in treeKey &&
          treeKey.$ref !== traveltaget
        ) {
          force = true
        }
        treeKey.$ref = traveltaget
      } else if ('$ref' in tree && '$remove' in subs) {
        treeKey.$ref = tree.$ref[key]
      }

      if ((force || treeKey.$) !== leafStamp) {
        treeKey.$ = leafStamp
        if ('val' in subs && (subs.val === true || force)) {
          update(keyTarget, UPDATE, stamp, subs, treeKey)
        }
        diff(traveltaget, subs, update, tree[key], stamp, rTree, force)
        if ('$ref' in treeKey && (!ref && keyTarget !== treeKey.$ref)) {
          delete treeKey.$ref
        }
        if ('done' in subs) {
          update(keyTarget, UPDATE, stamp, subs, treeKey, DONE)
        }
      }
    }
  } else if (treeKey) {
    remove(key, keyTarget, subs, update, tree, treeKey, stamp, rTree, force)
  }
}