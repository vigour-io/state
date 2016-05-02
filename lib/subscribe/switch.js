'use strict'
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const REMOVE = dictionary.REMOVE
const SWITCH = dictionary.SWITCH
const DONE = dictionary.DONE

const diff = require('./diff')

module.exports = function switcher (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const method = subs.switch
  var treeKey = tree.$switch
  var switchKey = method(target, INIT, stamp, subs, tree)
  if (switchKey) { switchKey = subs[switchKey] }
  if (!treeKey) {
    if (switchKey) {
      treeKey = tree.$switch = { _p: tree }
      treeKey.$ = switchKey
      treeKey.$ref = target
      if (subs.val) {
        update(target, INIT, stamp, switchKey, treeKey, SWITCH)
      }
      diff(target, switchKey, update, treeKey, stamp, rTree, rSubs, force)
      if (subs.done) {
        update(target, INIT, stamp, switchKey, treeKey, DONE) // multiple types how to handle??
      }
    }
  } else {
    let updating
    let remove = !target || target.val === null
    if (treeKey.$ !== switchKey || treeKey.$ref !== target) {
      diff(void 0, treeKey.$, update, treeKey, stamp, rTree, rSubs, force)
      treeKey.$ref = target // this needs optmizations ofc
      updating = true
      if (subs.val === true) {
        update(target, remove ? REMOVE : UPDATE, stamp, switchKey, treeKey, SWITCH)
      }
    }
    if (switchKey) {
      diff(target, switchKey, update, treeKey, stamp, rTree, rSubs, force)
    }
    if (subs.done && updating) {
      update(target, remove ? REMOVE : UPDATE, stamp, switchKey, treeKey, DONE)
    }
  }
}
