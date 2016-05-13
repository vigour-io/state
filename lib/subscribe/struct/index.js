'use strict'
const diff = require('../diff')
const dictionary = require('../dictionary')
const remove = require('./remove')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const DONE = dictionary.DONE
const perf = require('vigour-performance')

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp) {
  const keyTarget = target && target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = keyTarget._lstamp + (keyTarget._uid || keyTarget.uid())
    let traveltarget
    if (keyTarget.val && keyTarget.val._base_version) {
      traveltarget = keyTarget.origin()
    } else {
      traveltarget = keyTarget
    }
    if (!treeKey) {
      treeKey = tree[key] = { _p: tree, _key: key }
      treeKey.$ = leafStamp
      if ('val' in subs) {
        update(keyTarget, INIT, stamp, subs, treeKey)
      }
      diff(traveltarget, subs, update, treeKey, stamp)
      if ('done' in subs) {
        update(keyTarget, INIT, stamp, subs, treeKey, DONE)
      }
    } else {
      if (treeKey.$ !== leafStamp) {
        treeKey.$ = leafStamp
        if ('val' in subs && subs.val === true) {
          update(keyTarget, UPDATE, stamp, subs, treeKey)
        }
        diff(traveltarget, subs, update, tree[key], stamp)
        if ('done' in subs) {
          update(keyTarget, UPDATE, stamp, subs, treeKey, DONE)
        }
      }
    }
  } else if (treeKey) {
    remove(key, keyTarget, subs, update, tree, treeKey, stamp)
  }
}