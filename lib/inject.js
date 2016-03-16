'use strict'
var hash = require('vigour-util/hash')
module.exports = function (base) {
  var _on = base.on
  base.set({
    properties: {
      _lstamp: true,
      _hash: true,
      cachedSyncPath: true
    },
    define: {
      on (type, val) {
        if (val && val.$map && this.$) {
          this.$(val.$map(), void 0, false, val)
        }
        return _on.apply(this, arguments)
      },
      hash: {
        get () {
          return !this._hash ? (this._hash = hash(this.syncPath.join('.'))) : this._hash
        }
      }
    },
    on: {
      data: {
        lstamp (data, event) {
          // so this does not fire for everyone...
          var parent = this
          while (parent && parent._lstamp !== event.stamp) {
            parent._lstamp = event.stamp
            if (parent._on.data.base && parent !== this) {
              parent.emit('data', data, event) // may be too heavy
            }
            parent = parent.parent
          }
        }
      }
    }
  })
  base.set({
    properties: {
      order: new base.Constructor({
        on: {
          data: {
            order () {
              this.parent.parent._keys = null
            }
          }
        }
      })
    }
  })
}
