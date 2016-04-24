'use strict'
var merge = require('./merge')
var set = require('lodash.set')
var get = require('lodash.get')
var addSubscriber = require('./merge').a

exports.define = {
  $map (map, o) {
    var returnValue
    var n
    var p = o || this

    if (!map) {
      returnValue = map = {}
    }
    if (p .$any) {
      n = { $any: p .Child.prototype.$map() }
      n.$any.val = true
      let field = get(map, p .$)
      if (field) {
        merge(field, n)
      } else {
        set(map, p .$, n)
        field = get(map, p .$)
      }
      addSubscriber(field.$any, p .Child.prototype, { $any: p .Child.prototype })
      // addSubscriber(field, this)
    }

    if (p .$) {
      if (!returnValue) {
        returnValue = true
      }
      // only probs can have this -- this is too many update for sure
      if (p .$ !== true) {
        console.info('other', p.path())
        let t = {
          val: true,
          _: p  // need to handle
        }
        if (n) {
          merge(n, t)
        } else {
          n = t
        }
        var x = get(map, p.$)
        if (x) {
          addSubscriber(x, p)
          merge(x, n)
        } else {
          set(map, p.$, n)
        }
        map = x || n
      }
    }

    p.each(function each (p, key, base, map) {
      if (p.$map) {
        let change = p.$map(map)
        if (change) {
          if (!returnValue) {
            returnValue = true
          }
        } else {
          p.noState = true // also for props of course -- important
        }
      }
    }, false, map)
    return returnValue
  }
}
