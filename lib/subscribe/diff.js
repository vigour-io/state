'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp) {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== 'done' && key !== '$remove') {
      if (item(key, target, subs, subs[key], update, tree, stamp)) {
        changed = true
      }
    }
  }
  return changed
}

item = require('./item')
