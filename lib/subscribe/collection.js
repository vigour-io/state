'use strict'
const item = require('./item')

module.exports = function collection (target, pSubs, subs, update, tree, stamp) {
  var changed
  if (target && target.val !== null) {
    let keys = target._keys || target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (item(keys[i], target, pSubs, subs, update, tree, stamp)) {
          changed = true
        }
      }
    } else if (tree) {
      keys = Object.keys(tree)
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key') {
          if (item(keys[i], target, pSubs, subs, update, tree, stamp)) {
            changed = true
          }
        }
      }
    }
  }
  return changed
}
