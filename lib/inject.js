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
        console.log('fire lstamp listener:', val, stamp)
        var parent = this
        while (parent && parent._lstamp !== stamp) {
          console.log('--->', parent.path())
          parent._lstamp = stamp
          if (parent._subscriptions) {
            // this is too often need to gaurd
            console.log('subs it', parent.path())
            parent.emit('subscription', val, stamp)
          }
          parent = parent.cParent()
        }
      }
    }
  }
}
