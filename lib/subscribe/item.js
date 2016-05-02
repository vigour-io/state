'use strict'
var leaf, collection, struct, root, switcher
module.exports = function item (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (key !== 'val' && key !== '$' && key !== '_' && key !== 'done') {
    if (key === '$root') {
      root(target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    } else if (key === '$any') {
      collection(target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    } else if (key === '$switch') {
      switcher(key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    } else if (subs === true) {
      leaf(key, target, pSubs, update, tree, stamp, rTree, rSubs, force)
    } else {
      struct(key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    }
  }
}

leaf = require('./leaf')
collection = require('./collection')
struct = require('./struct')
root = require('./root')
switcher = require('./switch')
