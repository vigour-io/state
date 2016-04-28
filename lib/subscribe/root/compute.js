'use strict'
const rootStamp = require('./stamp')

module.exports = function computeRoot (target, cTree, stamp, rTree, rSubs, istamp) {
  const rTarget = target.getRoot()
  const rStamp = rootStamp(rTarget, cTree, stamp, rTree, rSubs)
  if (rStamp) {
    if (!istamp) {
      istamp = rStamp
    } else {
      istamp += rStamp
    }
  }
  return istamp
}
