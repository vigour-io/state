'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp, rTree, rSubs, force) {
  for (var key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== 'done') {
      item(key, target, subs, subs[key], update, tree, stamp, rTree, rSubs, force)
    }
  }
}

item = require('./item')
