'use strict'
const isTest = /^\$test/
const isSwitch = /^\$switch/
var any, struct, root, switcher, parent, $parent, test, diff
module.exports = function item (key, target, subs, update, tree, stamp, self, force) {
  if (key[0] === '$') {
    if (key === '$root') {
      return root(target, subs, update, tree, stamp, force)
    } else if (key === '$any') {
      return any(target, subs, update, tree, stamp, self, force)
    } else if (key === '$self') {
      return diff(target, subs, update, tree, stamp, true, force)
    } else if (key === '$parent') {
      return $parent(target, subs, update, tree, stamp, force)
    } else if (isTest.test(key)) { // think its faster to use indexOf here or even char for loop
      return test(key, target, subs, update, tree, stamp, force)
    } else if (isSwitch.test(key)) {
      return switcher(key, target, subs, update, tree, stamp, force)
    } else if (key !== '$' && key !== '$c') {
      return struct(
        key,
        target,
        subs,
        update,
        tree,
        key in tree && tree[key],
        stamp,
        self,
        force
      )
    }
  } else if (key === 'parent') {
    return parent(target, subs, update, tree, stamp, force)
  } else {
    // let treekey = self ? key + '-$' : key
    return struct(
      key,
      target && key in target && target[key],
      subs,
      update,
      tree,
      key in tree && tree[key],
      stamp,
      self,
      force
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
