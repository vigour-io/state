'use strict'
var leaf, collection, struct, root

module.exports = function item (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (key !== 'val' && key !== '$' && key !== '_') {
    if (key === '$root') {
      root(target, pSubs, subs, update, tree, stamp, rTree, rSubs)
    } else if (key === '$any') {
      collection(target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    } else if (subs === true) {
      leaf(key, target, pSubs, update, tree, stamp, rTree, rSubs, force)
    } else {
      struct(key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    }
  }
}

// order is convuted now but only way to do it
leaf = require('./leaf')
collection = require('./collection')
struct = require('./struct')
root = require('./root')
