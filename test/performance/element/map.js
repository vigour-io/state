'use strict'
var set = require('lodash.set')
var get = require('lodash.get')

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
        } else {
          a[i] = { val: a[i] }
          merge(a[i], b[i])
        }
      }
    }
  }
  return a
}

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
      let field = get(map, this.$)
      if (field) {
        console.log('MERGER')
        merge(field, n)
      } else {
        set(map, this.$, n)
        field = get(map, this.$)
      }
      // this all does nto work yet
      if (field.$any._) {
        if (field.$any._ instanceof Array) {
          field.$any._.push({ $any: this.Child.prototype })
        } else {
          field.$any._ = [ field.$any._, { $any: this.Child.prototype } ]
        }
      } else {
        console.log('????', field, map, map.collection)
        field.$any._ = { $any: this.Child.prototype }
        field._ = this
      }
    } if (this.$) {
      // only probs can have this -- this is too many update for sure
      if (this.$ !== true) {
        let t = {
          val: true,
          _: this // need to handle
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

// needs improvement
// need to set has$: true to everything
// meh meh meh