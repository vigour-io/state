'use strict'
const dictionary = require('./dictionary')
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE
const SWITCH = dictionary.SWITCH
const DONE = dictionary.DONE

const diff = require('./diff')

module.exports = function switcher (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  const method = subs.switch
  console.log(method)
  var treeKey = tree.$switch
  // may need origin info as well passing tree
  var switchKey = method(target, INIT, stamp, subs, tree)
  if (switchKey) {
    switchKey = subs[switchKey]
  }
  if (!treeKey) {
    if (switchKey) {
      treeKey = tree.$switch = {}
      //  val  (state, type, stamp, subs, tree, sType) {
      // send update ?
      // .val and done -- fix it
      console.log(update)
      if (subs.val) {
        update(target, INIT, stamp, switchKey, treeKey, SWITCH)
      }
      diff(target, switchKey, update, treeKey, stamp, rTree, rSubs, force)
      if (subs.done) {
        update(target, INIT, stamp, switchKey, treeKey, DONE) // multiple types how to handle??
      }
      console.log('CREATE SWITCH!')
    }
  } else {

  }

  // tree will store $switch -- this is the current tree -- how to know which one it is? -- _id? or something like that?
  // then you know what to remove? -- and you also know if there is a difference
  // or do we just use the stamp to calc the difference? -- also switch needs to apply on something!
}
