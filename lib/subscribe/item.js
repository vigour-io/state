'use strict'
var collection, struct, root, switcher, parent
module.exports = function item (key, target, pSubs, subs, update, tree, stamp) {
  if (key === '$root') {
    root(target, pSubs, subs, update, tree, stamp)
  } else if (key === '$any') {
    collection(target, pSubs, subs, update, tree, stamp)
  } else if (key === '$switch') {
    switcher(target, pSubs, subs, update, tree, stamp)
  } else {
    struct(key, target, pSubs, subs, update, tree, stamp)
  }
}

collection = require('./collection')
struct = require('./struct')
parent = require('./parent')
root = require('./root')
switcher = require('./switch')
