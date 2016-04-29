'use strict'
const generateStamp = require('./stamp')
const consts = require('./const')
const INIT = consts.INIT
const UPDATE = consts.UPDATE
const REMOVE = consts.REMOVE

module.exports = function leaf (key, target, subs, update, tree, stamp, rTree, rSubs, force) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs, update)
    if (!tree[key]) {
      tree[key] = leafStamp
      update(keyTarget, INIT, stamp, subs, tree)
    } else if ((force || treeKey) !== leafStamp) {
      tree[key] = leafStamp
      update(keyTarget, UPDATE, stamp, subs, tree)
    }
  } else if (treeKey) {
    update(keyTarget, REMOVE, stamp, subs, tree)
    delete tree[key]
  }
}
