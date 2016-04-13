'use strict'
const REMOVE = require('./const').REMOVE
const item = require('./item')
module.exports = function collection (target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (target && target.val !== null) {
    let keys = target._keys || target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        // if no longer has a key.. remove from tree!
        item(keys[i], target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
      }
    }
  } else if (tree && update) {
    update.call(target, REMOVE, stamp, subs, tree)
  }
}
