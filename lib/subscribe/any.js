'use strict'
const item = require('./item')
const composite = require('./composite')

// make a test for thi!
module.exports = function collection (target, subs, update, tree, stamp) {
  var changed
  if (target && target.val !== null) {
    const sid = target._sid || target.sid()
    const leafStamp = target.stamp + sid

    if (!('$any' in tree)) {
      tree.$any = {
        _p: tree,
        _key: '$any',
        $: leafStamp,
        $sid: sid
      }
      changed = true
    } else {
      if (sid !== tree.$any.$sid) {
        let keys = Object.keys(tree.$any)
        for (let i = 0, len = keys.length; i < len; i++) {
          if (keys[i][0] !== '$' && keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key') {
            item(keys[i], target, subs, update, tree.$any, stamp)
          }
        }
        changed = true
        tree.$any = {
          _p: tree,
          _key: '$any',
          $sid: sid,
          $: leafStamp
        }
      }
    }
    if (tree.$any.$ !== leafStamp || changed) {
      tree.$any.$ = leafStamp
      let keys = target._keys && target.keys()
      if (keys && keys.length) {
        for (let i = 0, len = keys.length; i < len; i++) {
          if (item(keys[i], target, subs, update, tree.$any, stamp)) {
            changed = true
          }
        }
      } else if (tree && '$any' in tree) {
        changed = removeExisting(changed, target, subs, update, tree, stamp)
      }
    } else if ('$c' in tree.$any) {
      changed = composite(target, subs, update, tree.$any, stamp, true)
    }
  } else if ('$remove' in subs && tree && '$any' in tree) {
    changed = removeExisting(changed, target, subs, update, tree, stamp)
  }
  return changed
}

function removeExisting (changed, target, subs, update, tree, stamp) {
  const keys = Object.keys(tree.$any)
  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i] !== '_' && keys[i] !== '_p' && keys[i] !== '_key' && keys[i][0] !== '$') {
      if (item(keys[i], target, subs, update, tree.$any, stamp)) {
        changed = true
      }
    }
  }
  delete tree.$any
  return changed
}
