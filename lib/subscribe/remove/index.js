'use strict'
const diff = require('../diff')
const composite = require('../composite')
const removeVal = require('../val').remove
const removeComposite = require('./composite')

module.exports = function remove (key, target, subs, update, tree, treeKey, stamp) {
  if ('$remove' in subs) {
    diff(target, subs, update, treeKey, stamp)
  }
  removeVal(target, subs, update, treeKey, stamp)
  if ('$c' in tree) {
    removeComposite(tree, key)
  }
  delete tree[key]
}
