'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const ROOT = 'root'
const merge = require('lodash.merge')
// const set = require('lodash.set')

module.exports = function (target, subscription, update, tree) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, event) {
    handleUpdate(target, subscription, update, tree, event, tree, subscription)
  })
  target._subscriptions = true
  handleUpdate(target, subscription, update, tree, void 0, tree, subscription)
  return tree
}

function handleUpdate (target, subscription, update, tree, event, roottree, rootsubscription) {
  for (let key in subscription) {
    handleItem(key, target, subscription, subscription[key], update, tree, event, roottree, rootsubscription)
  }
}

function handleItem (key, target, subscription, subs, update, tree, event, roottree, rootsubscription) {
  // $s is used for derived subscriptions (e.g. parent/root)
  if (key !== 'val' && key !== '$s') {
    if (key === '~') {
      console.log('---> root it')
      root(subs, target, subscription, update, tree, event, roottree, rootsubscription)
    } else if (key === '*') {
      collection(subs, target, subscription, update, tree, event, roottree, rootsubscription)
    } else if (subs === true) {
      leaf(key, target, subscription, update, tree, event, roottree, rootsubscription)
    } else {
      console.log('---> struct it', key)
      struct(subs, key, target, subscription, update, tree, event, roottree, rootsubscription)
    }
  }
}

function leaf (key, target, subscription, update, tree, event, roottree, rootsubscription) {
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

function struct (subs, key, target, subscription, update, tree, event, roottree, rootsubscription) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey, event, roottree)
    if (!tree[key]) {
      tree[key] = { $: stamp }
      tree[key].$ = stamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event, roottree, rootsubscription)
    } else if (tree[key].$ !== stamp) {
      tree[key].$ = stamp
      if ((subs.val) && update) {
        update.call(keyTarget, UPDATE, event, subs)
      }
      handleUpdate(target[key], subs, update, tree[key], event, roottree, rootsubscription)
    }
  } else if (treeKey) {
    if (update && (subs.val || subs['~'] || subscription['*'])) {
      // lets see if its nessecary to have ~ here may not be nessecary at all
      update.call(keyTarget, REMOVE, event, subs)
    }
    delete tree[key]
  }
}

function collection (subs, target, subscription, update, tree, event, roottree, rootsubscription) {
  if (target && target.__input !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        handleItem(keys[i], target, subscription, subs, update, tree, event, roottree, rootsubscription)
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
  let segmentTarget = target.getRoot()[path[i]]
  while (i < (len - 1)) {
    if (!segment.$c) {
      segment.$c = {}
    }
    let nextKey = path[i + 1]
    if (segment.$c[nextKey]) {
      if (segment.$c[nextKey] !== type) {
        segment.$c[nextKey] = [ segment.$c[nextKey], type ]
        // (target, tree, event, roottree)
        generateStamp(segmentTarget, segment, event, roottree)
      }
    } else {
      segment.$c[nextKey] = type
      generateStamp(segmentTarget, segment, event, roottree)
    }
    // segmentTarget[]
    let next = path[++i]
    segment = segment[next]
    segmentTarget = segmentTarget[next]
  }
}

function root (subs, target, subscription, update, tree, event, roottree, rootsubscription) {
  if (!tree.$r) {
    tree.$r = subs // definetly faster
    let rootTarget = target.getRoot() // need to get syncpath root (do this later)
    for (let key in subs) {
      let roottreeTarget = roottree[key]
      if (rootTarget[key]) {
        let subsKey = subs[key]
        // if you want immutable subs then we need to create an object
        console.log('diff against rsubs "', rootsubscription[key], '"')
        if (subsKey === true) {
          // same for function of course
          // this is a bit of a shame
          subsKey = subs[key] = { val: true }
          // need to check top-subscription as well unfortunately
          // if empty remove
        }

        // can reuse all this stuff -- can also be send to the server
        if (!roottreeTarget) {
          roottreeTarget = roottree[key] = {}
        }
        if (!roottreeTarget.$s) {
          roottreeTarget.$s = {}
        }
        // make this shorter and work out all the cases!
        // if (!roottreeTarget.$m) {
          // roottreeTarget.$m = {}
        // }
        // really needs to become a lot smaller! -- work out the parent case as well!
        // get this $m smaller -- also work out the ref case
        // set(roottreeTarget.$m, target.syncPath, { $s: subsKey })
        merge(roottreeTarget.$s, subsKey)
      }
    }
    composite(target, tree, update, event, roottree, ROOT)
  }

  // now lets see if we can do some updates
}

function generateStamp (target, tree, event, roottree) {
  if (tree && tree.$c) {
    let stamp = target._lstamp
    // walk trough $c -- and check if its ok! -- get stamps from the walkin
    for (let key in tree.$c) {
      // can immediatly caluclate the subs were wanting
      console.log('#do it!', tree[key])
    }
    console.log('#better handle those composite stamps here', target.path, tree.$c)
    return stamp
  } else {
    return target._lstamp
  }
}
