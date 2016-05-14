'use strict'
const REMOVE = require('./dictionary').REMOVE
const item = require('./item')

module.exports = function collection (target, pSubs, subs, update, tree, stamp) {
  if (target && target.val !== null) {
    let keys = target._keys || target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        item(keys[i], target, pSubs, subs, update, tree, stamp)
      }
    } else if (tree) {
      let keys = Object.keys(tree)
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key') {
          item(keys[i], target, pSubs, subs, update, tree, stamp)
        }
      }
    }
  } else if (tree) {
    update(target, REMOVE, stamp, subs, tree)
  }
}
