'use strict'
const diff = require('./diff')
const val = require('./val')
const valUpdate = val.update
const valCreate = val.create
const simpleUpdate = val.simpleUpdate
const remove = require('./remove')
const composite = require('./composite')

module.exports = function struct (key, target, pSubs, subs, update, tree, stamp) {
  const keyTarget = target && target[key]
  var treeKey = tree[key]
  var changed
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = keyTarget._lstamp + (keyTarget._uid || keyTarget.uid())
    let traveltarget
    if (keyTarget.val && keyTarget.val._base_version) {
      traveltarget = keyTarget.origin()
    } else {
      traveltarget = keyTarget
    }
    if (!treeKey) {
      treeKey = tree[key] = { _p: tree, _key: key }
      treeKey.$ = leafStamp
      valCreate(keyTarget, traveltarget, subs, update, treeKey, stamp)
      changed = true
    } else {
      if (treeKey.$ !== leafStamp) {
        treeKey.$ = leafStamp
        valUpdate(keyTarget, traveltarget, subs, update, treeKey, stamp)
        changed = true
      } else if ('$c' in treeKey) {
        // have to know if composite is updated thats a bit of a bummer
        changed = composite(traveltarget, subs, update, treeKey, stamp)
        if (changed) {
          simpleUpdate(keyTarget, subs, update, treeKey, stamp)
        }
      }
    }
  } else if (treeKey) {
    remove(key, keyTarget, subs, update, tree, treeKey, stamp)
    changed = true
  }
  return changed
}
