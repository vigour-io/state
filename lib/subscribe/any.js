'use strict'
const item = require('./item')

// make a test for thi!
module.exports = function collection (target, subs, update, tree, stamp) {
  var changed
  if (target && target.val !== null) {
    let $ = target.sid()
    if (!('$any' in tree)) {
      tree.$any = {
        _p: tree,
        _key: '$any',
        $: $
      }
    } else {
      if ($ !== tree.$any.$) {
        let keys = Object.keys(tree.$any)
        for (let i = 0, len = keys.length; i < len; i++) {
          if (keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key') {
            if (item(keys[i], target, subs, update, tree.$any, stamp)) {
              changed = true
            }
          }
        }
        tree.$any = {
          _p: tree,
          _key: '$any',
          $: $
        }
      }
      tree.$any.$ = $
    }
    let keys = target._keys && target.keys()
    if (keys && keys.length) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i][0] !== '$' && item(keys[i], target, subs, update, tree.$any, stamp)) {
          changed = true
        }
      }
    } else if (tree && '$any' in tree) {
      changed = removeExisting(changed, target, subs, update, tree, stamp)
    }
  } else if ('$remove' in subs && tree && '$any' in tree) {
    changed = removeExisting(changed, target, subs, update, tree, stamp)
  }
  return changed
}

function removeExisting (changed, target, subs, update, tree, stamp) {
  const keys = Object.keys(tree.$any)
  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key') {
      if (item(keys[i], target, subs, update, tree.$any, stamp)) {
        changed = true
      }
    }
  }
  delete tree.$any
  return changed
}
