'use strict'
var set = require('lodash.set')
var merge = require('lodash.merge')

exports.define = {
  $map (map) {
    var returnValue
    var n
    if (!map) {
      returnValue = map = {}
    }
    if (this.$any) {
      n = { $any: this.Child.prototype.$map() }
      n.$any.val = true
      n.$any._ = { $any: this.Child }
      set(map, this.$, n)
      // map = n.$any
    } if (this.$) {
      // only probs can have this -- this is too many update for sure
      if (this.$ !== true) {
        let t = {
          val: true,
          _: this
        }
        if (n) {
          merge(n, t)
        } else {
          n = t
        }
        set(map, this.$, n)
        map = n
      }
    }
    this.each(each, false, map) // use keys and properties
    return returnValue
  }
}

// function hasMap (p) {
//   return p.$map
// }

function each (p, key, base, map) {
  p.$map && p.$map(map)
}
