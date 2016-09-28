'use strict'
const val = require('./val')
const valUpdate = val.update
const valCreate = val.create
const simpleUpdate = val.simpleUpdate
const remove = require('./remove')
const composite = require('./composite')

module.exports = function struct (key, target, subs, update, tree, treeKey, stamp, self) {
  var changed
  if (target && (!('val' in target) || target.val !== null)) {
    let leafStamp = (target._sid || target.sid()) + target.stamp
    let traveltarget
    if (target.val && !self && target.val.isBase) {
      traveltarget = target.origin()
    } else {
      traveltarget = target
    }
    if (!treeKey) {
      treeKey = tree[key] = { _p: tree, _key: key }
      treeKey.$ = leafStamp
      valCreate(target, traveltarget, subs, update, treeKey, stamp)
      changed = true
    } else {
      if (treeKey.$ !== leafStamp) {
        treeKey.$ = leafStamp
        valUpdate(target, traveltarget, subs, update, treeKey, stamp)
        changed = true
      } else if ('$c' in treeKey) {
        changed = composite(traveltarget, subs, update, treeKey, stamp)
        if (changed) {
          simpleUpdate(target, subs, update, treeKey, stamp)
        }
      }
    }
  } else if (treeKey) {
    remove(key, target, target, subs, update, tree, treeKey, stamp)
    changed = true
  }
  return changed
}
