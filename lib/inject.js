'use strict'
var vstamp = require('vigour-stamp')
var subscribe = require('./subscribe')

function keyToNumber (key) {
  var hash = 0
  if (key.length === 0) {
    return hash
  }
  for (let i = 0, len = key.length; i < len; i++) {
    hash = ((hash << 5) + hash) + key.charCodeAt(i)
    hash |= 0
  }
  console.log(hash)
  return hash
}

module.exports = {
  properties: {
    _lstamp: true,
    _sid: true,
    _subscriptions: true,
    cachedSyncPath: true
  },
  // make it easy to create different stamps when using a hub (source ids etc)
  _lstamp: 0,
  define: {
    isState: { value: true },
    keysCheck (val, key) {
      const target = val[key]
      return target &&
        target.isState &&
        !target.keyType
    },
    subscribe (subs, update, tree, stamp, attach, id) {
      return subscribe(this, subs, update, tree, stamp, attach, id)
    },
    sid () {
      if (!('_sid' in this)) {
        if (!this.key) {
          this._sid = 1
        } else {
          this._sid = this.cParent().sid() + keyToNumber(this.key)
          console.log(this._sid)
        }
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
