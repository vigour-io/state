'use strict'

module.exports = {
  properties: {
    _lstamp: true,
    _subscriptions: true,
    cachedSyncPath: true
  },
  define: { subscribe: require('./subscribe') },
  on: {
    data: {
      lstamp (data, event) {
        var parent = this
        while (parent && parent._lstamp !== event.stamp) {
          parent._lstamp = event.stamp
          if (parent._subscriptions) {
            parent.emit('subscription', data, event)
          }
          parent = parent.parent
        }
      }
    }
  }
}
