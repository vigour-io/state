'use strict'
const remove = require('./remove')
const removeComposite = require('./remove/composite')
const val = require('./val')
const switchCreate = val.switchCreate
const switchUpdate = val.switchUpdate
const struct = require('./struct')

module.exports = function switchStruct (key, target, subs, update, tree, stamp) {
  const exec = subs.exec
  var switchTree = tree[key]
  var changed
  const switchKey = exec(target, tree, key)
  const switcher = subs[switchKey]
  if (!switchTree) {
    if (switcher) {
      switchTree = tree[key] = { _p: tree, _key: key }
      switchTree.$ = switcher
      switchTree.$target = target
      switchCreate(target, subs, update, switchTree, stamp)
      struct('$current', target, switcher, update, switchTree, void 0, stamp)
      changed = true
    }
  } else {
    let init
    if (switchTree.$ !== switcher || (switchTree.$target !== target)) {
      init = true
      if ('$' in switchTree) {
        if ('$remove' in switchTree.$) {
          struct('$current', void 0, switchTree.$, update, switchTree, switchTree.$current, stamp)
        } else if ('$c' in switchTree) {
          removeComposite(tree, key)
        }
        if ('$remove' in subs) {
          remove(key, target, void 0, switchTree.$, update, tree, switchTree, stamp)
        }
      }

      // delete switchTree.$pass
      // delete switchTree.$c
      // lets try to do this faster no recreate!
      switchTree = tree[key] = { _p: tree, _key: key }
      switchTree.$target = target
      if (switcher) {
        switchTree.$ = switcher
      }
      switchUpdate(target, subs, update, switchTree, stamp)
      changed = true
    }

    if (switcher) {
      if (init) {
        struct('$current', target, switcher, update, switchTree, void 0, stamp)
      } else {
        changed = struct('$current', target, switcher, update, switchTree, switchTree.$current, stamp)
      }
    }
  }

  return changed
}
