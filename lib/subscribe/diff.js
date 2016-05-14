'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp) {
  // let changed
  for (var key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== 'done' && key !== '$remove') {
      item(key, target, subs, subs[key], update, tree, stamp)
    }
  }
}

item = require('./item')
