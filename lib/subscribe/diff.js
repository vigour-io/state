'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp, self, force) {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') { // key !== 'done'
      if (item(key, target, subs[key], update, tree, stamp, self, force)) {
        changed = true
      }
    }
  }
  return changed
}

item = require('./item')
