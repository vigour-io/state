'use strict'
const diff = require('./diff')
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const REMOVE = dictionary.REMOVE
const SWITCH = dictionary.SWITCH

module.exports = function switcher (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const map = subs.map
  var treeKey = tree.$switch
  var switchKey = map(target, INIT, stamp, subs, tree)
  if (switchKey) { switchKey = subs[switchKey] }
  if (!treeKey) {
    if (switchKey) {
      treeKey = tree.$switch = { _p: tree, _key: key }
      treeKey.$ = switchKey
      treeKey.$ref = target
      if (subs.val) {
        update(target, INIT, stamp, switchKey, treeKey, SWITCH)
      }
      diff(target, switchKey, update, treeKey, stamp, rTree, rSubs, force)
    }
  } else {
    if (treeKey.$ !== switchKey || treeKey.$ref !== target) {
      diff(void 0, treeKey.$, update, treeKey, stamp, rTree, rSubs, force)
      treeKey = tree.$switch = { _p: tree }
      treeKey.$ref = target
      if (switchKey) {
        treeKey.$ = switchKey
      }
      if (subs.val === true) {
        update(target, !target || target.val === null ? REMOVE : UPDATE, stamp, switchKey, treeKey, SWITCH)
      }
    }
    if (switchKey) {
      diff(target, switchKey, update, treeKey, stamp, rTree, rSubs, force)
    }
  }
}
