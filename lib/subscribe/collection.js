'use strict'
const item = require('./item')

module.exports = function collection (target, subs, update, tree, stamp) {
  var changed
  if (target && target.val !== null) {
    if (!tree.$any) {
      tree.$any = {
        _p: tree,
        _key: '$any'
      }
    }
    // can become a better check
    let keys = target._keys && target.keys()
    if (keys && keys.length) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] !== 'emitters' && item(keys[i], target, subs, update, tree.$any, stamp)) {
          changed = true
        }
      }
    } else if (tree && tree.$any) {
      keys = Object.keys(tree.$any)
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key') {
          if (item(keys[i], target, subs, update, tree.$any, stamp)) {
            changed = true
          }
        }
      }
      delete tree.$any
    }
  }
  return changed
}
