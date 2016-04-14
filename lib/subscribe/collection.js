'use strict'
const REMOVE = require('./const').REMOVE
const item = require('./item')
module.exports = function collection (target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (target && target.val !== null) {
    let keys = target._keys || target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        item(keys[i], target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
      }
    }
  } else if (tree && update) {
    // want ptree for element! how to do it???
    update.call(target, REMOVE, stamp, subs, tree)
  }
}
