'use strict'
var vstamp = require('vigour-stamp')
var subscribe = require('./subscribe')

module.exports = {
  properties: {
    _lstamp: true,
    _subscriptions: true,
    cachedSyncPath: true
  },
  define: {
    subscribe (subs, update, tree, stamp) {
      return subscribe(this, subs, update, tree, stamp)
    }
  },
  on: {
    data: {
      lstamp: function lstamp (val, stamp) {
        var parent = this.cParent()
        this._lstamp = stamp
        if (this._subscriptions) {
          let l = this
          vstamp.on(stamp, function () {
            l.emit('subscription', val, stamp)
          })
        } else {
          while (parent && parent._lstamp !== stamp) {
            lstampInner(parent, val, stamp)
            parent = parent.cParent()
          }
        }
      }
    }
  }
}

function lstampInner (parent, val, stamp) {
  parent._lstamp = stamp
  if (parent._subscriptions) {
    let l = parent
    vstamp.on(stamp, function () {
      l.emit('subscription', val, stamp)
    })
  } else if ('base' in parent.__on._data) {
    if (parent.__on._data.base) {
      parent.__on._data.base.each(function (p) {
        lstampInner(p, val, stamp)
      })
    }
  }
}