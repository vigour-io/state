'use strict'
var set = require('lodash.set')
var get = require('lodash.get')

function merge (a, b) {
  if (typeof b !== 'object') {
    if (!a.val) { a.val = b }
  } else {
    for (var i in b) {
      if (i !== '_') { // && i !== 'val'
        if (typeof a[i] === 'object') {
          merge(a[i], b[i])
        } else if (!a[i]) {
          a[i] = b[i]
        } else if (i !== 'val') {
          a[i] = { val: a[i] }
          merge(a[i], b[i])
        }
      } else {
        console.log('add the subscriber!', a._, b._)
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
      if (target._._base_version || target._.$any) {
        // console.log('yo yo yo --->', target._.$any) --- make this nice and good not very ugly like this
        target._ = { [target._.$any && target._.$any !== true ? target._.$any.uid() : target._.uid()]: target._ }
      }
      target._[obs.uid()] = thing || obs
    } else {
      target._ = thing || obs
    }
  }
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
        console.log('hello?', field, n)
        merge(field, n)
      } else {
        set(map, this.$, n)
        field = get(map, this.$)
      }

      addSubscriber(field.$any, this.Child.prototype, { $any: this.Child.prototype })
      // addSubscriber(field, this)
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
          n = t
        }
        var x = get(map, this.$)
        if (x) {
          console.log('---> ADD', this.inspect(), this.path(), x._)
          addSubscriber(x, this)
          merge(x, n)
        } else {
          set(map, this.$, n)
        }
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
