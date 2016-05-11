'use strict'
const REMOVE = require('./dictionary').REMOVE
const item = require('./item')

module.exports = function collection (target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (target && target.val !== null) {
    let keys = target._keys || target.keys()
    if (keys) {
      // this is fucked build for different behaviour -- wants keys to be the same...
      // nasty...
      // now we need to check in the the tree keys? -- madness!
      // keep a length field on the tree?
      // add a special thing to keys in state?
      console.log(keys)
      for (let i = 0, len = keys.length; i < len; i++) {
        item(keys[i], target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
      }
    } else if (tree.$ref && tree.$ref !== target) {
      let keys = tree.$ref._keys || tree.$ref.keys()
      for (let i = 0, len = keys.length; i < len; i++) {
        item(keys[i], target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
      }
    }
  } else if (tree) {
    update(target, REMOVE, stamp, subs, tree)
  }
}
