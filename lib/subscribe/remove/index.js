'use strict'
const diff = require('../diff')
const removeComposite = require('./composite')
const isTest = /^\$test/
var test
const REMOVE = 'remove'

module.exports = function remove (key, target, travelTarget, subs, update, tree, treeKey, stamp) {
  if ('$remove' in subs) {
    diff(travelTarget, subs, update, treeKey, stamp)
  } else {
    // needs to get optmized!!! this is very slow -- need ssomething like .hasTest
    for (let sub in subs) {
      if (sub[0] === '$') {
        // needs to ne optmized!
        if (isTest.test(sub)) {
          test(sub, target, subs[sub], update, treeKey, stamp)
        }
      }
    }
  }

  if ('val' in subs) {
    update(target, REMOVE, stamp, subs, treeKey)
  }

  if ('$c' in tree) {
    removeComposite(tree, key)
  }
  delete tree[key]
}

test = require('../test')
