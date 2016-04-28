'use strict'
const generateStamp = require('./stamp')
const consts = require('./const')
const INIT = consts.INIT
const UPDATE = consts.UPDATE
const REMOVE = consts.REMOVE
const diff = require('./diff') // aint pretty but nessecary for now

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const keyTarget = target[key]
  var treeKey = tree[key]
  console.log('struct:', key)
  if (keyTarget && keyTarget.val !== null) {
    console.log('  gen stamp froms struct: ', 'force:', force, ', treestamp:', treeKey && treeKey.$)
    let leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs)
    console.log('  genstamp result:', leafStamp)
    if (!treeKey) {
      console.log('  new tree')
      treeKey = tree[key] = { $: leafStamp }
      // TEMP NEED TO FIND A SOLUTION
      if (rTree.parent) {
        treeKey._parent = tree
      }
      // -----------------------------

      treeKey.$ = leafStamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, stamp, subs, treeKey, tree)
      }
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    } else if ((force || treeKey.$) !== leafStamp) {
      treeKey.$ = leafStamp
      if (subs.val === true && update) {
        update.call(keyTarget, UPDATE, stamp, subs, treeKey, tree)
      }
      diff(keyTarget, subs, update, tree[key], stamp, rTree, rSubs, force)
    }
  } else if (treeKey) {
    if (keyTarget && keyTarget.val === null) {
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    }
    if (update && subs.val) {
      update.call(keyTarget, REMOVE, stamp, subs, treeKey, tree)
    }
    if (tree.$c && tree.$c[key]) {
      delete tree.$c[key]
    }
    delete tree[key]
  }
}
