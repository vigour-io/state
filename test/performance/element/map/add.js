'use strict'
const set = require('lodash.set')
const get = require('lodash.get')

module.exports = function (val, map, target, subs, subsTarget) {
  if (!subs) { subs = target.$ } // also allow for arrays
  const field = get(map, subs)
  subscribe(subsTarget ? get(val, subsTarget) : val, target)
  if (field) {
    merge(field, val, subsTarget)
    return field
  } else {
    set(map, subs, val)
    return val
  }
}

function merge (a, b) {
  if (b && typeof b !== 'object') {
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
        subscribe(a, b._)
      }
    }
  }
}

function subscribe (target, obs) {
  if (typeof obs === 'object' && !obs._base_version) {
    for (let uid in obs) {
      subscribe(target, obs[uid])
    }
  } else {
    if (target._) {
      if (target._._base_version) {
        target._ = { [target._.uid()]: target._ }
      }
      target._[obs.uid()] = obs
    } else {
      target._ = obs
    }
  }
}
