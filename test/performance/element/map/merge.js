'use strict'
// var set = require('lodash.set')
// var get = require('lodash.get')

function merge (a, b) {
  if (typeof b !== 'object') {
    if (!a.val) { a.val = b }
  } else {
    for (var i in b) {
      if (i !== '_') {
        if (typeof a[i] === 'object') {
          merge(a[i], b[i])
        } else if (!a[i]) {
          a[i] = b[i]
        } else if (i !== 'val') {
          a[i] = { val: a[i] }
          merge(a[i], b[i])
        }
      } else {
        addSubscriber(a, b._)
      }
    }
  }
  return a
}

function addSubscriber (target, obs, thing) {
  if (typeof obs === 'object' && !obs._base_version) {
    for (var i in obs) {
      addSubscriber(target, obs[i], thing)
    }
  } else {
    if (target._) {
      if (target._._base_version) {
        target._ = { [target._.uid()]: target._ }
      }
      target._[obs.uid()] = thing || obs
    } else {
      target._ = thing || obs
    }
  }
}

module.exports = merge
merge.a = addSubscriber
