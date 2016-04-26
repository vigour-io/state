'use strict'
const add = require('./add')
const subscribe = require('./subscribe')

exports.define = {
  $map (map, any) {
    var returnValue
    if (!map) {
      returnValue = map = {}
    }
    this.each((p, key, base, map) => {
      if (p.$map) {
        let change = p.$map(map)
        if (change) {
          if (!returnValue) {
            returnValue = true
          }
        } else {
          // call this _noState, clearer
          p.noState = true
        }
      }
    }, false, map)

    if (this.$) {
      if (!returnValue) {
        returnValue = true
      }
      if (this.$any) {
        let val = { $any: this.Child.prototype.$map(void 0, true) }
        // only add and remove -- do it in state not like this...
        val.$any.val = 1 // for collection removal/addition
        add(val, map, this.Child.prototype, this.$, '$any')
      }
      map = add({ val: true, _: this }, map, this)
    } else if (returnValue && !any) {
      subscribe(map, this)
    }
    return returnValue
  }
}
