'use strict'
module.exports = {
  properties: {
    _lstamp: true,
    cachedSyncPath: true
  },
  on: {
    data: {
      lstamp (data, event) {
        var parent = this
        // console.log('hello!', this)
        while (parent && parent._lstamp !== event.stamp) {
          parent._lstamp = event.stamp
          // need more probably better to overwrite set?
          // check for a subs listener perhaps?
          // add subs as a listener type?
          // use attach?
          if (parent._on.data && parent !== this) {
            parent.emit('data', data, event) // may be too heavy
          }
          parent = parent.parent
        }
      }
    }
  }
}
