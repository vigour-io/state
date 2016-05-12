'use strict'
const diff = require('./diff')
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const REMOVE = dictionary.REMOVE
const SWITCH = dictionary.SWITCH

// ok this one needs to go

module.exports = function switchStruct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const map = subs.map
  var treeKey = tree.$switch
  const switchKey = map(target, INIT, stamp, subs, tree)
  const switcher = subs[switchKey]
  if (!treeKey) {
    if (switcher) {
      treeKey = tree.$switch = { _p: tree, _key: key }
      treeKey.$ = switcher
      treeKey.$ref = target
      if ('val' in subs) {
        update(target, INIT, stamp, switcher, treeKey, SWITCH)
      }
      diff(target, switcher, update, treeKey, stamp, rTree, rSubs, force)
    }
  } else {
    if (treeKey.$ !== switcher || treeKey.$ref !== target) {
      diff(void 0, treeKey.$, update, treeKey, stamp, rTree, rSubs, force)
      treeKey = tree.$switch = { _p: tree }
      treeKey.$ref = target
      if (switcher) {
        treeKey.$ = switcher
      }
      if ('val' in subs && subs.val === true) {
        update(target, !target || target.val === null ? REMOVE : UPDATE, stamp, switcher, treeKey, SWITCH)
      }
    }
    if (switcher) {
      diff(target, switcher, update, treeKey, stamp, rTree, rSubs, force)
    }
  }
}