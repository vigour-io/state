'use strict'
const item = require('../item')
const dictionary = require('../dictionary')
const ROOT = dictionary.ROOT
const INIT = dictionary.INIT

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
  var subs = sTree.$root
  var rstamp
  for (let skey in subs) {
    if (skey !== '$') {
      let typeOverride
      // make tests for remove as well!
      if (!sTree.$root[skey].$) {
        typeOverride = INIT
      }
      item(skey, target, subs, subs[skey], function (state, type, stamp, subs, tree) {
        subs.$ = tree.$
        if (!subs.val || subs.val === true || typeOverride) {
          update(state, typeOverride || type, stamp, subs, sTree, ROOT)
        }
      }, rTree, stamp, rTree, rSubs, force || sTree.$root[skey].$ || true)
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
