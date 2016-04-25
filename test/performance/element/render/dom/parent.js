'use strict'
const render = require('../index.js').single

module.exports = function (uid, target, state, type, stamp, subs, tree, ptree, rtree) {
  const parent = target.parent
  if (parent) {
    let parentUid = parent.uid()
    let pnode
    if (subs._[parentUid]) {
      pnode = tree._[parentUid]
      if (!pnode) {
        pnode = render(parent, state, type, stamp, subs, tree, ptree, rtree)
      }
    } else {
      pnode = findParent(ptree, parentUid)
    }
    return pnode
  }
}

function findParent (tree, uid) {
  while (tree) {
    if (tree._ && tree._[uid]) {
      return tree._[uid]
    }
    tree = tree._parent
  }
}
