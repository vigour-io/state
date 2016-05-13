'use strict'
const diff = require('../../diff')
const composite = require('../composite')
const removeComposite = require('./composite')
const dictionary = require('../../dictionary')
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
    removeComposite(tree, key)
  }
  delete tree[key]
}


