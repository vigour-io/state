'use strict'
var collection, struct, root, switcher, parent
module.exports = function item (key, target, pSubs, subs, update, tree, stamp) {
  if (key === '$root') {
    return root(target, pSubs, subs, update, tree, stamp)
  } else if (key === '$any') {
    return collection(target, pSubs, subs, update, tree, stamp)
  } else if (key === '$switch') {
    return switcher(target, pSubs, subs, update, tree, stamp)
  } else if (key === '$parent') {
    return parent(target, pSubs, subs, update, tree, stamp)
  } else {
    return struct(key, target, pSubs, subs, update, tree, stamp)
  }
}

collection = require('./collection')
struct = require('./struct')
parent = require('./parent')
root = require('./root')
switcher = require('./switch')
