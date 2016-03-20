'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const merge = require('lodash.merge')

module.exports = function (target, subscription, update, tree) {
  if (!tree) { tree = {} }
  target.on(function (data, event) {
    handleUpdate(target, subscription, update, tree, event, tree)
  })
  target._subscriptions = true
  handleUpdate(target, subscription, update, tree, void 0, tree)
  return tree
}

function handleUpdate (target, subscription, update, tree, event, roottree) {
  for (let key in subscription) {
    handleItem(key, target, subscription, subscription[key], update, tree, event, roottree)
  }
}

function handleItem (key, target, subscription, subs, update, tree, event, roottree) {
  if (key !== 'val') {
    if (key === '~') {
      root(subs, target, subscription, update, tree, event, roottree)
    } else if (key === '*') {
      collection(subs, target, subscription, update, tree, event, roottree)
    } else if (subs === true) {
      leaf(key, target, subscription, update, tree, event)
    } else {
      struct(subs, key, target, subscription, update, tree, event, roottree)
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

function struct (subs, key, target, subscription, update, tree, event, roottree) {
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
      handleUpdate(target[key], subs, update, tree[key], event, roottree)
    } else if (tree[key].$ !== stamp) {
      tree[key].$ = stamp
      if (subs.val) {
        update.call(keyTarget, UPDATE, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event, roottree)
    }
  } else if (treeKey) {
    update.call(keyTarget, REMOVE, event, subs)
    delete tree[key]
  }
}

function collection (subs, target, subscription, update, tree, event, roottree) {
  if (target && target.__input !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        handleItem(keys[i], target, subs, subs, update, tree, event, roottree)
      }
    }
  } else if (tree) {
    update.call(target, REMOVE, event, subs)
  }
}

function root (subs, target, subscription, update, tree, event, roottree) {
  console.log('root --->', subs)
  if (!tree.$r) {
    for (let key in subs) {
      if (subs[key] === true) {
        subs[key] = { val: true }
      }
    }
    console.log('create $r')
    let i = 0
    let path = target.syncPath
    let len = path.length
    let segment = roottree[path[i]]
    while (segment && i < len) {
      console.log('segment ---->', path[i], segment, path)
      if (segment.$r) {
        console.log(path[i], 'got $r merge check if there are differences')
      } else {
        segment.$r = merge({}, subs)
      }

      segment = segment[path[++i]]
    }
  }
}
