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
      switchTree.$ref = target
      // so lets fire fo switch create
      switchCreate(target, subs, update, switchTree, stamp)
      struct('$pass', target, switcher, update, switchTree, void 0, stamp)
      changed = true
    }
  } else {
    let init
    if (switchTree.$ !== switcher || switchTree.$ref !== target) {
      init = true
      if ('$' in switchTree) {
        if ('$remove' in switchTree.$) {
          struct('$pass', void 0, switchTree.$, update, switchTree, switchTree.$pass, stamp)
        } else if ('$c' in switchTree) {
          removeComposite(tree, key)
        }
        if ('$remove' in subs) {
          remove(key, target, void 0, switchTree.$, update, tree, switchTree, stamp)
        }
      }
      switchTree = tree[key] = { _p: tree, _key: key }
      switchTree.$ref = target
      if (switcher) {
        switchTree.$ = switcher
      }
      switchUpdate(target, subs, update, switchTree, stamp)
      changed = true
    }

    if (switcher) {
      if (init) {
        struct('$pass', target, switcher, update, switchTree, switchTree.$pass, stamp)
      } else {
        changed = struct('$pass', target, switcher, update, switchTree, switchTree.$pass, stamp)
      }
    }
  }

  return changed
}
