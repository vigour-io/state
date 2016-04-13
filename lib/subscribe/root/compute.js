'use strict'
const rootStamp = require('./stamp')

module.exports = function computeRoot (target, cTree, event, rTree, rSubs, istamp) {
  var rTarget = target.getRoot()
  let rStamp = rootStamp(rTarget, cTree, event, rTree, rSubs)
  if (rStamp) {
    if (!istamp) {
      istamp = rStamp
    } else {
      istamp += rStamp
    }
  }
  return istamp
}
