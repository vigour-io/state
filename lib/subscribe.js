'use strict'
// var tree = require()
// first do tree makign yourself
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'

module.exports = function (target, subscription, update, tree) {
  if (!tree) { tree = {} }
  target.on(function (data, event) {
    handleUpdate(target, subscription, update, tree, event)
  })
  target._subscriptions = true
  handleUpdate(target, subscription, update, tree)
  return tree
}

// need unsubscribe as well will come
function handleUpdate (target, subscription, update, tree, event) {
  for (let key in subscription) {
    if (key !== 'val') {
      let subs = subscription[key]
      if (subs === true) {
        leaf(key, target, subscription, update, tree, event)
      } else {
        console.log('HANDLE OBJ!')
        struct(subs, key, target, subscription, update, tree, event)
      }
    }
  }
}

function leaf (key, target, subscription, update, tree, event) {
  var keyTarget = target[key]
  var treeKey = tree[key]
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
}

function struct (subs, key, target, subscription, update, tree, event) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = keyTarget._lstamp
    if (!tree[key]) {
      tree[key] = { $: stamp }
      tree[key].$ = stamp
      if (subs.val) {
        update.call(keyTarget, INIT, event)
      }
      handleUpdate(target[key], subs, update, tree[key], event)
    } else if (tree[key].$ !== stamp) {
      tree[key].$ = stamp
      if (subs.val) {
        update.call(keyTarget, UPDATE, event)
      }
      handleUpdate(target[key], subs, update, tree[key], event)
    }
  } else if (treeKey) {
    update.call(keyTarget, REMOVE, event)
    delete tree[key]
  }
}
