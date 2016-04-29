'use strict'
const item = require('../item')

module.exports = function computeRoot (target, cTree, stamp, rTree, rSubs, istamp, update, force) {
  const rTarget = target.getRoot()
  const rStamp = execute(rTarget, cTree, stamp, rTree, rSubs, update, force)
  if (rStamp) {
    if (!istamp) {
      istamp = rStamp
    } else {
      istamp += rStamp
    }
  }
  return istamp
}

function execute (target, sTree, stamp, rTree, rSubs, update, force) {
  var subs = sTree.$r
  var rstamp
  for (let skey in subs) {
    if (skey !== '$') {
      item(skey, target, subs, subs[skey], function (state, type, stamp, subs, tree) {
        subs.$ = tree.$
        update(state, type, stamp, subs, sTree)
      }, rTree, stamp, rTree, rSubs, force || sTree.$r[skey].$ || true)
      if (subs[skey].$) {
        if (!rstamp) {
          rstamp = subs[skey].$
        } else {
          rstamp += subs[skey].$
        }
      }
    }
  }
  if (rstamp) {
    subs.$ = rstamp
    return rstamp
  }
}
