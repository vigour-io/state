'use strict'
var item

module.exports = function diff (target, subs, update, tree, stamp, rTree, rSubs, force, soverride) {
  for (var key in subs) {
    item(key, target, subs, subs[key], update, tree, stamp, rTree, rSubs, force, soverride)
  }
}

// temp fix (order is convuluted)
item = require('./item')
