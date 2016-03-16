'use strict'
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
          if (parent._subscriptions && parent !== this) {
            parent.emit('data', data, event) // may be too heavy
          }
          parent = parent.parent
        }
      }
    }
  }
}
