'use strict'
// var tree = require()
// first do tree makign yourself

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
  for (var key in subscription) {
    if (target[key]) {
      if (subscription[key] === true) {
        if (!tree[key]) {
          tree[key] = target[key]._lstamp
          update(target[key], event, true)
        } else if (tree[key] !== target[key]._lstamp) {
          update(target[key], event)
        }
        // special remove case
      } else {
        console.log('HANDLE OBJ!')
      }
    }
  }
}
