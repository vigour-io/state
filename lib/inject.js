'use strict'
var vstamp = require('vigour-stamp')
var subscribe = require('./subscribe')

function keyToNumber (key) {
  if (typeof key === 'string') {
    let num = 0
    for (let i = 0, len = key.length; i < len; i++) {
      num += key.charCodeAt(i)
    }
    return num
  } else {
    return key
  }
}

module.exports = {
  properties: {
    _lstamp: true,
    _sid: true,
    _subscriptions: true,
    cachedSyncPath: true
  },
  _lstamp: 0,
  define: {
    subscribe (subs, update, tree, stamp) {
      return subscribe(this, subs, update, tree, stamp)
    },
    // sourceid
    sid () {
      if (!this._sid) {
        let parent = this
        let num = 0
        while (parent && parent.key) {
          num += keyToNumber(parent.key)
          parent = parent.cParent()
        }
        this._sid = num
      }
      return this._sid
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