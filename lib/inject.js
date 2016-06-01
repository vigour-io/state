'use strict'
var vstamp = require('vigour-stamp')
var subscribe = require('./subscribe')

// make this into a util super handy
function keyToNumber (key) {
  var hash = 0
  for (let i = 0, len = key.length; i < len; i++) {
    hash = ((hash << 5) + hash) + key.charCodeAt(i)
    hash |= 0
  }
  return hash
}

module.exports = {
  properties: {
    stamp: true,
    _sid: true
  },
  // make it easy to create different stamps when using a hub (source ids etc)
  stamp: 0,
  define: {
    isState: { value: true },
    // this is wrong!
    filter (key) {
      return 'isState' in this[key]
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
        }
      }
      return this._sid
    }
  },
  on: {
    data: {
      stamp (val, stamp) {
        var parent = this.cParent()
        this.stamp = stamp
        if (this._subscriptions) {
          let l = this
          vstamp.on(stamp, function () {
            l.emit('subscription', val, stamp)
          })
        } else {
          looper(parent, val, stamp)
        }
      }
    }
  }
}

function looper (parent, val, stamp) {
  while (parent && parent.stamp !== stamp) {
    lstampInner(parent, val, stamp)
    parent = parent.cParent()
  }
}

function lstampInner (parent, val, stamp) {
  parent.stamp = stamp
  if (parent._subscriptions) {
    let l = parent
    vstamp.on(stamp, function () {
      l.emit('subscription', val, stamp)
    })
  } else if ('base' in parent._emitters._data) {
    if (parent._emitters._data.base) {
      parent._emitters._data.base.each(function (p) {
        looper(p, val, stamp)
      })
    }
  }
}
