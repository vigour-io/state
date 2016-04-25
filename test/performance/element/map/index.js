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
        val.$any.val = true // for collection removal/addition
        add(val, map, this.Child.prototype, this.$, '$any')
      }
      map = add({ val: true, _: this }, map, this)
    } else if (returnValue) {
      if (!any) {
        console.error('this is a traveler!', this.path())
        this._$t = true
        subscribe(map, this)
      } else {
        console.info('this is any so not a real traveler', this.path())
      }
      // need to know if this is a non state travelers
    } else {
      console.warn('this is a non state element', this.path())
    }
    return returnValue
  }
}
