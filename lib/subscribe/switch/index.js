'use strict'
const remove = require('../remove')
const removeComposite = require('../remove/composite')
const val = require('../val')
const switchCreate = val.switchCreate
const switchUpdate = val.switchUpdate
const struct = require('../struct')
const globExec = require('./glob')

module.exports = function switchStruct (key, target, subs, update, tree, stamp, force) {
  const exec = subs.exec || globExec
  var switchTree = tree[key]
  var changed
  const switchKey = exec(target, subs, tree, key)
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
          struct('$current', void 0, switchTree.$, update, switchTree, switchTree.$current, stamp, void 0, force)
        } else if ('$c' in switchTree) {
          removeComposite(tree, key)
        }
        if (
          '$remove' in subs &&
          '$' in switchTree &&
          '$current' in switchTree
        ) {
          remove(key, switchTree.$target, void 0, switchTree.$, update, tree, switchTree.$current, stamp)
        }
      }
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
        struct('$current', target, switcher, update, switchTree, void 0, stamp, void 0, force)
      } else {
        changed = struct('$current', target, switcher, update, switchTree, switchTree.$current, stamp, void 0, force)
      }
    }
  }

  return changed
}
