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
    // can use the same for remove (cleanup)
  }
}

function leaf (key, target, subscription, update, tree, event) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey)
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
    let stamp = generateStamp(keyTarget, treeKey, key)
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
  // lots of reuse with struct of course
  if (!tree.$r) {
    for (let key in subs) {
      if (subs[key] === true) {
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
      // update stamps for all segments
      segment.$ = generateStamp(segmentTarget, segment)

      // select new segment
      segment = segment[pathSegment]
      segmentTarget = segmentTarget[pathSegment]
    }
  }
  // have to check if it needs to update!
}

function generateStamp (target, tree, key) {
  if (tree && tree.$r) {
    console.log('generate root-stamp', target, key)
  }
  return target._lstamp
}

/*
handleUpdate (target, subscription, update, tree, event, roottree) {
  for (let key in subscription) {
    handleItem(key, target, subscription, subscription[key], update, tree, event, roottree)
  }
}
*/
