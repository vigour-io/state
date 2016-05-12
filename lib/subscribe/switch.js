'use strict'
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const REMOVE = dictionary.REMOVE
const SWITCH = dictionary.SWITCH

const diff = require('./diff')
const struct = require('./struct')

module.exports = function switchStruct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const map = subs.map
  var switchTree = tree.$switch
  var keyTree
  const switchKey = map(target, INIT, stamp, subs, tree)
  const switcher = subs[switchKey]
  if (!switchTree) {
    if (switcher) {
      switchTree = tree.$switch = { _p: tree, _key: '$switch' }
      switchTree.$ = switcher
      switchTree.$ref = target
      if ('val' in subs) {
        update(target, INIT, stamp, switcher, switchTree, SWITCH)
      }
      diff(target, switcher, update, switchTree, stamp, rTree, rSubs, force)
    }
  } else {
    if (switchTree.$ !== switcher || switchTree.$ref !== target) {
      diff(void 0, switchTree.$, update, switchTree, stamp, rTree, rSubs, force)
      // here it resets
      switchTree = tree.$switch = { _p: tree, _key: '$switch' }
      switchTree.$ref = target
      if (switcher) {
        switchTree.$ = switcher
      }
      if ('val' in subs && subs.val === true) {
        update(target, !target || target.val === null ? REMOVE : UPDATE, stamp, switcher, switchTree, SWITCH)
      }
    }
    if (switcher) {
      diff(target, switcher, update, switchTree, stamp, rTree, rSubs, force)
    }
  }
}