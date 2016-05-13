'use strict'
const isEmpty = require('vigour-util/is/empty')
const diff = require('../diff')
const composite = require('./composite')
const dictionary = require('../dictionary')
const REMOVE = dictionary.REMOVE
const DONE = dictionary.DONE

module.exports = function structRemove (key, keyTarget, subs, update, tree, treeKey, stamp) {
  if ('$remove' in subs) {
    diff(keyTarget, subs, update, treeKey, stamp)
  }
  if ('val' in subs) {
    update(keyTarget, REMOVE, stamp, subs, treeKey)
  }
  if ('done' in subs) {
    update(keyTarget, REMOVE, stamp, subs, treeKey, DONE)
  }
  if ('$c' in tree) {
    removeC(tree, key)
  }
  delete tree[key]
}

function removeC (tree, key) {
  while (tree && tree._p && '$c' in tree && tree.$c[key]) {
    delete tree.$c[key]
    if (isEmpty(tree.$c)) {
      delete tree.$c
    }
    key = tree._key
    tree = tree._p
  }
}
