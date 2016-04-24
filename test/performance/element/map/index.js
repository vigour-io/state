'use strict'
const add = require('./add')

exports.define = {
  $map (map) {
    var returnValue
    if (!map) {
      returnValue = map = {}
    }
    if (this.$) {
      if (!returnValue) {
        returnValue = true
      }
      if (this.$any) {
        let any = { $any: this.Child.prototype.$map() }
        any.$any.val = true // for collection removal/addition
        add(any, map, this.Child.prototype, this.$, '$any')
      }
      map = add({ val: true, _: this }, map, this)
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
    return returnValue
  }
}
