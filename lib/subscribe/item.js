'use strict'
const isTest = /^\$test/
const isSwitch = /^\$switch/
var any, struct, root, switcher, parent, $parent, test, diff
module.exports = function item (key, target, subs, update, tree, stamp, self) {
  if (key[0] === '$') {
    if (key === '$root') {
      return root(target, subs, update, tree, stamp)
    } else if (key === '$any') {
      return any(target, subs, update, tree, stamp, self)
    } else if (key === '$self') {
      return diff(target, subs, update, tree, stamp, true)
    } else if (key === '$parent') {
      return $parent(target, subs, update, tree, stamp)
    } else if (isTest.test(key)) { // think its faster to use indexOf here or even char for loop
      return test(key, target, subs, update, tree, stamp)
    } else if (isSwitch.test(key)) {
      return switcher(key, target, subs, update, tree, stamp)
    } else if (key !== '$' && key !== '$c') {
      let treekey = self ? key + '-$' : key
      return struct(
        treekey,
        target,
        subs,
        update,
        tree,
        treekey in tree && tree[treekey],
        stamp,
        self
      )
    }
  } else if (key === 'parent') {
    return parent(target, subs, update, tree, stamp)
  } else {
    let treekey = self ? key + '-$' : key
    return struct(
      treekey,
      target && key in target && target[key],
      subs,
      update,
      tree,
      treekey in tree && tree[treekey],
      stamp,
      self
    )
  }
}

any = require('./any')
struct = require('./struct')
$parent = require('./parent/subscription')
parent = require('./parent/origin')
root = require('./root')
switcher = require('./switch')
test = require('./test')
diff = require('./diff')
