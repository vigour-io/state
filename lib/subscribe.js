'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const merge = require('lodash.merge')

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
  if (key !== 'val' && key !== '$' && key !== '$r') {
    if (key === '~') {
      root(subs, target, subscription, update, tree, event, roottree)
    } else if (key === '*') {
      collection(subs, target, subscription, update, tree, event, roottree)
    } else if (subs === true) {
      leaf(key, target, subscription, update, tree, event, roottree)
    } else {
      struct(subs, key, target, subscription, update, tree, event, roottree)
    }
    // can use the same for remove (cleanup)
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
    if (update && (subs.val || subs['~'])) {
      update.call(keyTarget, REMOVE, event, subs)
    }
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
  } else if (tree && update) {
    update.call(target, REMOVE, event, subs)
  }
}

function root (subs, target, subscription, update, tree, event, roottree) {
  if (!tree.$r) {
    for (let key in subs) {
      if (subs[key] === true) {
        // may need to replace all leaf subs with this purely for readability and uniformity
        subs[key] = { val: true }
      }
    }
    let i = 0
    let path = target.syncPath
    let len = path.length
    let segment = roottree[path[i]]
    let segmentTarget = target.getRoot()[path[i]]
    while (segment && i < len) {
      let pathSegment = path[++i]
      if (segment.$r) {
        merge(segment.$r, subs)
      } else {
        segment.$r = merge({}, subs)
      }
      segment.$ = generateStamp(segmentTarget, segment, update, event, roottree)
      segment = segment[pathSegment]
      segmentTarget = segmentTarget[pathSegment]
    }
  }

  console.log('do we need an update here?')
  // have to check if it needs to update! -- best way to do this is add a val: true on the traget where you have a ~ ?
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
