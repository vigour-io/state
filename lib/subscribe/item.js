'use strict'
const isTest = /^\$test/
const isSwitch = /^\$switch/
var collection, struct, root, switcher, parent, $parent, test
module.exports = function item (key, target, subs, update, tree, stamp) {
  if (key[0] === '$') {
    if (key === '$root') {
      if (!tree._p) {
        throw (new Error('no $root subscription on root'))
      } else {
        return root(target, subs, update, tree, stamp)
      }
    } else if (key === '$any') {
      return collection(target, subs, update, tree, stamp)
    } else if (key === '$parent') {
      return $parent(target, subs, update, tree, stamp)
    } else if (isTest.test(key)) {
      return test(key, target, subs, update, tree, stamp)
    } else if (isSwitch.test(key)) {
      return switcher(key, target, subs, update, tree, stamp)
    } else if (key !== '$') {
      return struct(
        key,
        target,
        subs,
        update,
        tree,
        key in tree && tree[key],
        stamp
      )
    }
  } else if (key === 'parent') {
    return parent(target, subs, update, tree, stamp)
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
$parent = require('./parent/subscription')
parent = require('./parent/origin')
root = require('./root')
switcher = require('./switch')
test = require('./test')
