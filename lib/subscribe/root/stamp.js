'use strict'
const item = require('../item')

module.exports = function rootStamp (target, tree, stamp, rTree, rSubs) {
  var subs = tree.$r
  var rstamp
  for (let skey in subs) {
    if (skey !== '$') {
      item(skey, target, subs, subs[skey], updateStamp, rTree, stamp, rTree, rSubs, tree.$r.$ || true)
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

function updateStamp (type, stamp, subs, tree) {
  subs.$ = tree.$
}
