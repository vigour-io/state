'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const ROOT = 'root'
const merge = require('lodash.merge')
// const set = require('lodash.set')

module.exports = function (target, subs, update, tree) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, event) {
    handleUpdate(target, subs, update, tree, event, tree, subs)
  })
  target._subscriptions = true
  handleUpdate(target, subs, update, tree, void 0, tree, subs)
  return tree
}

function handleUpdate (target, subs, update, tree, event, rTree, rSubs) {
  for (let key in subs) {
    handleItem(key, target, subs, subs[key], update, tree, event, rTree, rSubs)
  }
}

function handleItem (key, target, pSubs, subs, update, tree, event, rTree, rSubs) {
  // $s is used for derived subscriptions (e.g. parent/root)
  if (key !== 'val' && key !== '$') {
    if (key === '~') { // preferably not '~' !!!will convert to hashtable (not ll) maybe do $root ? -- 10 double test this
      root(subs, target, pSubs, update, tree, event, rTree, rSubs)
    } else if (key === '*') {
      collection(subs, target, pSubs, update, tree, event, rTree, rSubs)
    } else if (subs === true) {
      leaf(key, target, pSubs, update, tree, event, rTree, rSubs)
    } else {
      struct(subs, key, target, pSubs, update, tree, event, rTree, rSubs)
    }
  }
}

function leaf (key, target, subs, update, tree, event, rTree, rSubs) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey, event, rTree, rSubs)
    if (!tree[key]) {
      tree[key] = stamp
      if (update) {
        update.call(keyTarget, INIT, event, subs, tree)
      }
    } else if (treeKey !== stamp) {
      tree[key] = stamp
      if (update) {
        update.call(keyTarget, UPDATE, event, subs, tree)
      }
    }
  } else if (treeKey) {
    if (update) {
      update.call(keyTarget, REMOVE, event, subs, tree)
    }
    delete tree[key]
  }
}

function struct (subs, key, target, pSubs, update, tree, event, rTree, rSubs) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey, event, rTree, rSubs)
    if (!treeKey) {
      treeKey = tree[key] = { $: stamp }
      treeKey.$ = stamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, event, subs, treeKey)
      }
      handleUpdate(target[key], subs, update, treeKey, event, rTree, rSubs)
    } else if (treeKey.$ !== stamp) {
      treeKey.$ = stamp
      if ((subs.val || subs['~']) && update) {
        update.call(keyTarget, UPDATE, event, subs, treeKey)
      }
      handleUpdate(target[key], subs, update, tree[key], event, rTree, rSubs)
    }
  } else if (treeKey) {
    if (update && (subs.val || subs['~'] || pSubs['*'])) {
      update.call(keyTarget, REMOVE, event, subs, treeKey)
    }
    delete tree[key]
  }
}

function collection (subs, target, pSubs, update, tree, event, rTree, rSubs) {
  if (target && target.__input !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        handleItem(keys[i], target, pSubs, subs, update, tree, event, rTree, rSubs)
      }
    }
  } else if (tree && update) {
    update.call(target, REMOVE, event, subs, tree)
  }
}

function composite (target, tree, update, event, type, rTree, rSubs) {
  let i = 0
  let path = target.syncPath
  let len = path.length
  let segment = rTree[path[i]]
  let segmentTarget = target.getRoot()[path[i]]
  while (i < (len - 1)) {
    if (!segment.$c) {
      segment.$c = {}
    }
    let nextKey = path[i + 1]
    if (segment.$c[nextKey]) {
      if (segment.$c[nextKey] !== type) {
        segment.$c[nextKey] = [ segment.$c[nextKey], type ]
        segment.$ = generateStamp(segmentTarget, segment, event, rTree, rSubs)
      }
    } else {
      segment.$c[nextKey] = type
      segment.$ = generateStamp(segmentTarget, segment, event, rTree, rSubs)
    }
    let next = path[++i]
    segment = segment[next]
    segmentTarget = segmentTarget[next]
  }
}

function root (subs, target, pSubs, update, tree, event, rTree, rSubs) {
  if (!tree.$r) {
    tree.$r = subs // definetly faster
    let rTarget = target.getRoot() // need to get syncpath root (do this later)
    for (let key in subs) {
      let rTreeTarget = rTree[key]
      if (rTarget[key]) {
        let rSubsKey = subs[key]
        // if we want immutable subs then we need to create an object
        console.log('diff against rsubs "', rSubs[key], '"')
        if (rSubsKey === true) {
          rSubsKey = rSubsKey[key] = { val: true }
        }
        // can reuse all this stuff -- can also be send to the server
        if (!rTreeTarget) {
          rTreeTarget = rTree[key] = {}
        }
        if (!rTreeTarget.$s) {
          rTreeTarget.$s = {}
        }
        // make this shorter and work out all the cases!
        // if (!roottreeTarget.$m) {
          // roottreeTarget.$m = {}
        // }
        // really needs to become a lot smaller! -- work out the parent case as well!
        // get this $m smaller -- also work out the ref case
        // set(roottreeTarget.$m, target.syncPath, { $s: subsKey })
        merge(rTreeTarget.$s, rSubsKey)
      }
    }
    composite(target, tree, update, event, ROOT, rTree, rSubs)
    tree.$ = generateStamp(target, tree, event, rTree, rSubs)
    if (update && tree.$r.$) {
      update.call(target, INIT, event, pSubs, tree)
    }
  }
}

function handleRootStamp (type, event, subs, tree) {
  subs.$ = tree.$
}

function handleRoot (key, target, tree, event, rTree, rSubs) {
  let subs = tree[key].$r
  for (let rkey in subs) {
    if (rkey !== '$') {
      handleItem(
        rkey,
        target,
        subs,
        subs[rkey],
        handleRootStamp,
        rTree,
        event,
        rTree,
        rSubs
      )
    }
  }
}

function generateStamp (target, tree, event, rTree, rSubs) {
  if (tree && tree.$r && tree.$r.$) {
    // should not return ofc -- also needs nested $c
    return (target._lstamp + tree.$r.$)
  }

  // ------------- totatly wrong ---------------
  if (tree && tree.$c) {
    let stamp = target._lstamp
    let rTarget
    for (let key in tree.$c) {
      // root handler
      if (tree[key].$r) {
        if (!rTarget) {
          rTarget = target.getRoot() // replace with syncRoot !
        }
        handleRoot(key, rTarget, tree, event, rTree, rSubs)
      }
      // ----------------

      if (tree[key].$c) {
        console.log('nested composite', key)
      }
    }
    // -----------------------------------------
    return stamp
  } else {
    return target._lstamp
  }
}
