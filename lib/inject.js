'use strict'
var vstamp = require('vigour-stamp')

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
            let l = parent
            vstamp.on(stamp, function () {
              l.emit('subscription', val, stamp)
            })
          }
          parent = parent.cParent()
        }
      }
    }
  }
}
