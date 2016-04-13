'use strict'
const REMOVE = require('./const').REMOVE
var item
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

item = require('./item') // don\'t like it but need it
