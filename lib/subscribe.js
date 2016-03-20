'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'

// hasComposite make it

module.exports = function (target, subscription, update, tree) {
  if (!tree) { tree = {} }
  target.on(function (data, event) {
    handleUpdate(target, subscription, update, tree, event)
  })
  target._subscriptions = true
  handleUpdate(target, subscription, update, tree)
  return tree
}

function handleUpdate (target, subscription, update, tree, event) {
  // this is the only reason ofcourse walks the leafs -- for now ignore tree top
  for (let key in subscription) {
    handleItem(key, target, subscription, subscription[key], update, tree, event)
  }
}

function handleItem (key, target, subscription, subs, update, tree, event) {
  if (key !== 'val') {
    if (key === '*') {
      collection(subs, target, subscription['*'], update, tree, event)
    } else if (subs === true) {
      leaf(key, target, subscription, update, tree, event)
    } else {
      struct(subs, key, target, subscription, update, tree, event)
    }
    // can us the same for remove (cleanup)
  }
}

function leaf (key, target, subscription, update, tree, event) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = keyTarget._lstamp
    if (!tree[key]) {
      tree[key] = stamp
      update.call(keyTarget, INIT, event, subscription)
    } else if (treeKey !== stamp) {
      tree[key] = stamp
      update.call(keyTarget, UPDATE, event, subscription)
    }
  } else if (treeKey) {
    update.call(keyTarget, REMOVE, event, subscription)
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
        update.call(keyTarget, INIT, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event)
    } else if (tree[key].$ !== stamp) {
      tree[key].$ = stamp
      if (subs.val) {
        update.call(keyTarget, UPDATE, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event)
    }
  } else if (treeKey) {
    update.call(keyTarget, REMOVE, event, subs)
    delete tree[key]
  }
}

function collection (subs, target, subscription, update, tree, event) {
  if (target && target.__input !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        handleItem(keys[i], target, subscription, subscription, update, tree, event)
      }
    }
  } else if (tree) {
    update.call(target, REMOVE, event, subs)
  }
}
