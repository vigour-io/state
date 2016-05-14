'use strict'
var collection, struct, root, switcher, parent, condition
module.exports = function item (key, target, subs, update, tree, stamp) {
  if (key === '$root') {
    return root(target, subs, update, tree, stamp)
  } else if (key === '$any') {
    return collection(target, subs, update, tree, stamp)
  } else if (key === '$switch') {
    return switcher(target, subs, update, tree, stamp)
  } else if (key === '$parent') {
    return parent(target, subs, update, tree, stamp)
  } else if (key === '$condition') {
    return condition(target, subs, update, tree, stamp)
  } else {
    return struct(key, target && target[key], subs, update, tree, tree[key], stamp)
  }
}

collection = require('./collection')
struct = require('./struct')
parent = require('./parent')
root = require('./root')
switcher = require('./switch')
condition = require('./condition')
