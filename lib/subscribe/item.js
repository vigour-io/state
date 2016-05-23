'use strict'
var collection, struct, root, switcher, parent, test
// var perf = global.perf = require('vigour-performance')
module.exports = function item (key, target, subs, update, tree, stamp) {
  // perf.type.test(item, key, target, subs, update, tree, stamp)
  if (key === '$root') {
    return root(target, subs, update, tree, stamp)
  } else if (key === '$any') {
    return collection(target, subs, update, tree, stamp)
  } else if (key === '$switch') {
    return switcher(target, subs, update, tree, stamp)
  } else if (key === '$parent') {
    return parent(target, subs, update, tree, stamp)
  } else if (key === '$test') {
    return test(target, subs, update, tree, stamp)
  } else {
    return struct(
      key,
      target && key in target && target[key],
      subs,
      update,
      tree,
      key in tree && tree[key],
      stamp
    )
  }
}

collection = require('./collection')
struct = require('./struct')
parent = require('./parent')
root = require('./root')
switcher = require('./switch')
test = require('./test')
