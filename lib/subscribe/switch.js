'use strict'
const diff = require('./diff')
const remove = require('./remove')
const removeComposite = require('./remove/composite')
const val = require('./val')
const valCreate = val.create
const switchCreate = val.switchCreate
const switchUpdate = val.switchUpdate
const struct = require('./struct')

/*
 return struct(
    key,
    target && key in target && target[key],
    subs,
    update,
    tree,
    key in tree && tree[key],
    stamp
  )
*/

module.exports = function switchStruct (key, target, subs, update, tree, stamp) {
  const exec = subs.exec
  var switchTree = tree[key]
  var changed
  const switchKey = exec(target, tree, key)
  const switcher = subs[switchKey]

  console.log(' \n go for it switch!')

  // pretty simple fix

  if (!switchTree) {
    if (switcher) {
      switchTree = tree[key] = { _p: tree, _key: key }
      switchTree.$ = switcher
      switchTree.$ref = target
      // ---------------------------------------
      switchCreate(target, subs, update, switchTree, stamp)
      // ---------------------------------------
      console.log('yo whatup')
      console.log('------')
      // if ('val' in subs) {
      //   update(target, 'new', stamp, switcher, switchTree)
      // }
      // this is def wrong
      // diff(target, switcher, update, switchTree, stamp)
      valCreate(target, target, switcher, update, switchTree, stamp)
      console.log('------')
      changed = true
    }
  } else {
    let init
    if (switchTree.$ !== switcher || switchTree.$ref !== target) {
      init = true
      if ('$' in switchTree) {
        if ('$remove' in switchTree.$) {
          // dit moet met struct sowieso maak test want anders is niet zo nice
          diff(void 0, switchTree.$, update, switchTree, stamp)
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
        console.log(' -->ok struct?')

        console.log('too support this we need to add random keys on the switchtree...', switchKey, switchTree)
        // changed = struct(switchKey, target, switcher, update, switchTree, switchTree[switchKey], stamp)

        changed = diff(target, switcher, update, switchTree, stamp)
      }
    }
  }
  return changed
}
