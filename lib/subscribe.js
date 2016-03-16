'use strict'
// var tree = require()
// first do tree makign yourself
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'

module.exports = function (target, subscription, update, tree) {
  if (!tree) {
    tree = {}
  }

  console.log(subscription)

  target.on(function (data, event) {
    handleUpdate(target, subscription, update, tree, event)
  })

  handleUpdate(target, subscription, update, tree)
  // need the diffuclt case for element ASAP

  return tree
  // this is the handler -- create those trees
}

// need unsubscribe as well will come
function handleUpdate (target, subscription, update, tree, event) {
  for (let key in subscription) {
    let subs = subscription[key]
    if (subs === true) {
      // leaf
      let keyTarget = target[key]
      let treeKey = tree[key]
      if (keyTarget && keyTarget.__input !== null) {
        let stamp = keyTarget._lstamp
        if (!tree[key]) {
          tree[key] = stamp
          update.call(keyTarget, INIT, event)
        } else if (treeKey !== stamp) {
          tree[key] = stamp
          update.call(keyTarget, UPDATE, event)
        }
      } else if (treeKey) {
        update.call(keyTarget, REMOVE, event)
        delete tree[key]
      }
    } else {
      console.log('HANDLE OBJ!')
    }
  }
}
