'use strict'
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const REMOVE = dictionary.REMOVE
const SWITCH = dictionary.SWITCH
const DONE = dictionary.DONE

const diff = require('./diff')
const struct = require('./struct')
const remove = require('./struct/remove')
const removeComposite = require('./struct/remove/composite')

module.exports = function switchStruct (target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
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
        update(target, INIT, stamp, subs, switchTree, SWITCH)
      }
      if ('val' in switcher) {
        update(target, INIT, stamp, switcher, switchTree)
      }
      diff(target, switcher, update, switchTree, stamp, rTree, rSubs, force)
      if ('done' in switcher) {
        update(target, INIT, stamp, switcher, switchTree, DONE)
      }
    }
  } else {
    let type = UPDATE
    if (switchTree.$ !== switcher || switchTree.$ref !== target) {
      type = INIT
      if ('$' in switchTree) {
        if ('$remove' in switchTree.$) {
          diff(void 0, switchTree.$, update, switchTree, stamp, rTree, rSubs, force)
        } else if ('$c' in switchTree) {
          removeComposite(tree, '$switch')
        }
        if ('$remove' in subs) {
          remove('$switch', void 0, switchTree.$, update, tree, switchTree, stamp, rTree, force)
        }
      }
      switchTree = tree.$switch = { _p: tree, _key: '$switch' }
      switchTree.$ref = target
      if (switcher) {
        switchTree.$ = switcher
      }
      if ('val' in subs && subs.val === true) {
        update(target, !target || target.val === null ? REMOVE : UPDATE, stamp, subs, switchTree, SWITCH)
      }
    }
    if (switcher) {
      if (type === INIT) {
        if ('val' in switcher) {
          update(target, type, stamp, switcher, switchTree)
        }
        diff(target, switcher, update, switchTree, stamp, rTree, rSubs, force)
        if ('done' in switcher) {
          update(target, type, stamp, switcher, switchTree, DONE)
        }
      } else {
        diff(target, switcher, update, switchTree, stamp, rTree, rSubs, force)
      }
    }
  }
}
