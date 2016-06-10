'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp) {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') { // key !== 'done'
      console.log(key, subs, target)
      if (item(key, target, subs[key], update, tree, stamp)) {
        changed = true
      }
    }
  }
  return changed
}

item = require('./item')
