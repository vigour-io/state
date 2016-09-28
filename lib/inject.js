'use strict'
const vstamp = require('vigour-stamp')
const subscribe = require('./subscribe')
const keyHash = require('vigour-util/keyHash')
const hash = require('vigour-util/hash')

module.exports = {
  inject: [
    require('vigour-is'),
    require('./resubscribe')
  ],
  properties: {
    stamp: true,
    _sid: true
  },
  stamp: 0,
  define: {
    isState: { value: true },
    filter (key) {
      return 'isState' in this[key]
    },
    subscribe (subs, update, tree, stamp, attach, id) {
      return subscribe(this, subs, update, tree, stamp, attach, id)
    },
    sid () {
      if (!('_sid' in this)) {
        if (!this.key || !this._parent) {
          this._sid = 1
        } else {
          this._sid = (this.cParent().sid() + keyHash(this.key))
        }
      }
      return this._sid
    }
  },
  on: {
    data: {
      stamp (val, s) {
        var parent = this.cParent()
        this.stamp = s
        if (this._subscriptions) {
          let l = this
          vstamp.on(s, function () {
            l.emit('subscription', val, s)
          })
        } else {
          looper(parent, val, s)
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
  } else if (parent._emitters && ('base' in parent._emitters._data)) {
    if (parent._emitters._data.base) {
      parent._emitters._data.base.each(function (p) {
        looper(p, val, stamp)
      })
    }
  }
}
