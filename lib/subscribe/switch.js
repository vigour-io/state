'use strict'
const diff = require('./diff')
const remove = require('./remove')
const removeComposite = require('./remove/composite')
const val = require('./val')
const valCreate = val.create
const switchCreate = val.switchCreate
const switchUpdate = val.switchUpdate

module.exports = function switchStruct (target, subs, update, tree, stamp) {
  const exec = subs.exec
  var switchTree = tree.$switch
  var changed
  const switchKey = exec(target, stamp, subs, tree)
  const switcher = subs[switchKey]
  if (!switchTree) {
    if (switcher) {
      switchTree = tree.$switch = { _p: tree, _key: '$switch' }
      switchTree.$ = switcher
      switchTree.$ref = target
      // ---------------------------------------
      switchCreate(target, subs, update, switchTree, stamp)
      // ---------------------------------------
      valCreate(target, target, switcher, update, switchTree, stamp)
      changed = true
    }
  } else {
    let init
    if (switchTree.$ !== switcher || switchTree.$ref !== target) {
      init = true
      if ('$' in switchTree) {
        if ('$remove' in switchTree.$) {
          diff(void 0, switchTree.$, update, switchTree, stamp)
        } else if ('$c' in switchTree) {
          removeComposite(tree, '$switch')
        }
        if ('$remove' in subs) {
          remove('$switch', target, void 0, switchTree.$, update, tree, switchTree, stamp)
        }
      }
      switchTree = tree.$switch = { _p: tree, _key: '$switch' }
      switchTree.$ref = target
      if (switcher) {
        switchTree.$ = switcher
      }
      // ---------------------------------------
      switchUpdate(target, subs, update, switchTree, stamp)
      changed = true
      // ---------------------------------------
    }
    if (switcher) {
      if (init) {
        valCreate(target, target, switcher, update, switchTree, stamp)
        changed = true
      } else {
        changed = diff(target, switcher, update, switchTree, stamp)
      }
    }
  }
  return changed
}
