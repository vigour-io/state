'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const ROOT = 'root'

module.exports = function (target, subscription, update, tree) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, event) {
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
      leaf(key, target, subscription, update, tree, event, roottree)
    } else {
      struct(subs, key, target, subscription, update, tree, event, roottree)
    }
  }
}

function leaf (key, target, subscription, update, tree, event, roottree) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey, event, roottree)
    if (!tree[key]) {
      tree[key] = stamp
      if (update) {
        update.call(keyTarget, INIT, event, subscription)
      }
    } else if (treeKey !== stamp) {
      tree[key] = stamp
      if (update) {
        update.call(keyTarget, UPDATE, event, subscription)
      }
    }
  } else if (treeKey) {
    if (update) {
      update.call(keyTarget, REMOVE, event, subscription)
    }
    delete tree[key]
  }
}

function struct (subs, key, target, subscription, update, tree, event, roottree) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey, event, roottree)
    if (!tree[key]) {
      tree[key] = { $: stamp }
      tree[key].$ = stamp
      if (subs.val && update) {
        update.call(keyTarget, INIT, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event, roottree)
    } else if (tree[key].$ !== stamp) {
      tree[key].$ = stamp
      if ((subs.val || subs['~']) && update) {
        update.call(keyTarget, UPDATE, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event, roottree)
    }
  } else if (treeKey) {
    if (update && (subs.val || subs['~'] || subscription['*'])) {
      update.call(keyTarget, REMOVE, event, subs)
    }
    delete tree[key]
  }
}

function collection (subs, target, subscription, update, tree, event, roottree) {
  if (target && target.__input !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        handleItem(keys[i], target, subscription, subs, update, tree, event, roottree)
      }
    }
  } else if (tree && update) {
    update.call(target, REMOVE, event, subs)
  }
}

function composite (target, tree, update, event, roottree, type) {
  let i = 0
  let path = target.syncPath
  let len = path.length
  let segment = roottree[path[i]]
  while (i < (len - 1)) {
    if (!segment.$c) {
      segment.$c = {}
    }
    let nextKey = path[i + 1]
    if (segment.$c[nextKey]) {
      if (segment.$c[nextKey] !== type) {
        segment.$c[nextKey] = [ segment.$c[nextKey], type ]
      }
    } else {
      segment.$c[nextKey] = type
    }
    segment = segment[path[++i]]
  }
}

function root (subs, target, subscription, update, tree, event, roottree) {
  if (!tree.$r) {
    composite(target, tree, update, event, roottree, ROOT)
    tree.$r = subs // definetly faster
  }
}

function generateStamp (target, tree, event, roottree) {
  if (tree && tree.$r) {
    let stamp = target._lstamp
    let roottarget = target.getRoot()
    for (let key in tree.$r) {
      if (roottarget[key]) {
        handleItem(key, roottarget, tree.$r, tree.$r[key], void 0, tree.$r, event, roottree)
        if (tree.$r[key].$) {
          stamp += tree.$r[key].$
        }
      }
    }
    return stamp
  } else {
    return target._lstamp
  }
}
