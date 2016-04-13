'use strict'
const generateStamp = require('./stamp')
const consts = require('./const')
const INIT = consts.INIT
const UPDATE = consts.UPDATE
const REMOVE = consts.REMOVE
var diff

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs)
    if (!treeKey) {
      treeKey = tree[key] = { $: leafStamp }
      treeKey.$ = leafStamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, stamp, subs, treeKey)
      }
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    } else if ((force || treeKey.$) !== leafStamp) {
      treeKey.$ = leafStamp
      if ((subs.val) && update) {
        update.call(keyTarget, UPDATE, stamp, subs, treeKey)
      }
      diff(keyTarget, subs, update, tree[key], stamp, rTree, rSubs, force)
    }
  } else if (treeKey) {
    if (keyTarget && keyTarget.val === null) {
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    }
    if (update && subs.val) {
      update.call(keyTarget, REMOVE, stamp, subs, treeKey)
    }
    if (tree.$c && tree.$c[key]) {
      delete tree.$c[key]
    }
    delete tree[key]
  }
}

diff = require('./diff') // aint pretty but nessecary for now
console.log('assholes', diff)
