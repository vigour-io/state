'use strict'
var Observable = require('vigour-observable')

module.exports = {
  properties: {
    _lstamp: true,
    _subscriptions: true,
    cachedSyncPath: true
  },
  on: {
    data: {
      lstamp (data, event) {
        var parent = this
        while (parent && parent._lstamp !== event.stamp) {
          parent._lstamp = event.stamp
          if (parent._subscriptions) {
            let p = parent
            if (p) { p.emit('subscription', data, event) }
          }
          parent = parent.parent
        }
      }
    }
  }
}
