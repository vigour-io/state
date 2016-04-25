'use strict'
const create = require('./create')
const Observable = require('vigour-observable')
const _generateConstructor = Observable.prototype.generateConstructor

exports.define = {
  render (state, type, stamp, subs, tree, ptree, rtree, pnode) {
    const uid = this.uid()
    var domNode = tree._ && tree._[uid]
    if (type === 'remove') {
      if (domNode) {
        tree._[uid].parentNode.removeChild(domNode)
        delete tree._[uid]
      }
    } else if (!domNode) {
      domNode = create(uid, this, state, type, stamp, subs, tree, ptree, rtree, pnode)
    }
    return domNode
  },
  generateConstructor () {
    // way too much code to just set cachednode to false
    return function Element (val, stamp, parent, key) {
      this._Constructor = null
      this._cachedNode = false // find a better solution for this dirty as fuck
      // make a functio for this or something!
      // else need to use hasownprop and thats ofcourse super slow!
      // add a method here -- figure this out tmrw
      // need ot make sure you clear cached keys thingy
      if (this._i === false) {
        // console.log('--- dont!', this)
        this._i = null
      } else {
        this._i = null
        if (this._isChild) {
          this._isChild = null
        }
        this.clearContext()
        this.addToInstances(stamp)
      }
      this.setParent(val, stamp, parent, key)
      if (val !== void 0) {
        this.set(val, stamp, void 0, true)
      }
    }
  }
}
