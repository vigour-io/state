'use strict'
var set = require('lodash.set')
var get = require('lodash.get')

// wrong merge
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
        field.$any._ = { $any: this.Child.prototype }
        field._ = this
      }
    }

    if (this.$) {
      if (!returnValue) {
        returnValue = true
      }
      // only probs can have this -- this is too many update for sure
      if (this.$ !== true) {
        let t = {
          val: true,
          _: this // need to handle
        }
        if (n) {
          merge(n, t)
        } else {
          var x = get(map, this.$)
          if (x) {
            if (x._) {
              if (!(x._ instanceof Array)) {
                t._ = [ t._ ]
                t._.push(x._)
              } else {
                t._ = x._
                t._.push(this)
              }
            }
          }
          // totally wrong needs a merge
          n = t
        }
        set(map, this.$, n)
        map = n
      }
    }
    this.each(function each (p, key, base, map) {
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
