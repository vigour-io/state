'use strict'
const rootStamp = require('./stamp')

// make into one function just compute (together /w stamp)

module.exports = function computeRoot (target, cTree, stamp, rTree, rSubs, istamp, update, force) {
  const rTarget = target.getRoot()
  const rStamp = rootStamp(rTarget, cTree, stamp, rTree, rSubs, update, force)
  if (rStamp) {
    if (!istamp) {
      istamp = rStamp
    } else {
      istamp += rStamp
    }
  }
  return istamp
}
