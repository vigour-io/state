'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp, rTree, rSubs, force) {
  for (var key in subs) {
    item(key, target, subs, subs[key], update, tree, stamp, rTree, rSubs, force)
  }
}

// temp fix (order is convuluted)
item = require('./item')
