'use strict'
const create = require('./create')

exports.define = {
  render (state, type, stamp, subs, tree, ptree, rtree) {
    const uid = this.uid()
    var domNode = tree._ && tree._[uid]
    if (type === 'remove') {
      if (domNode) {
        tree._[uid].parentNode.removeChild(domNode)
        delete tree._[uid]
      }
    } else if (!domNode) {
      domNode = create(uid, this, state, type, stamp, subs, tree, ptree, rtree)
    }
    return domNode
  }
}
