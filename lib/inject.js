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
      lstamp (val, stamp) {
        var parent = this
        while (parent && parent._lstamp !== stamp) {
          parent._lstamp = stamp
          if (parent._subscriptions) {
            parent.emit('subscription', val, stamp)
          }
          parent = parent.parent
        }
      }
    }
  }
}
