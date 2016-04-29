'use strict'
const item = require('../item')

// rename to compute -- mucbh better

module.exports = function rootStamp (target, sTree, stamp, rTree, rSubs, update, force) {
  var subs = sTree.$r
  var rstamp
  for (let skey in subs) {
    if (skey !== '$') {
      item(skey, target, subs, subs[skey], function (state, type, stamp, subs, tree) {
        subs.$ = tree.$
        update(state, type, stamp, subs, sTree)
        // may go wrong -- but dont need $r $ ?
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
