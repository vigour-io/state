'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const ROOT = 'root'

module.exports = function (target, subs, update, tree) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, event) {
    diff(target, subs, update, tree, event, tree, subs)
  })
  target._subscriptions = true
  diff(target, subs, update, tree, void 0, tree, subs)
  return tree
}

function diff (target, subs, update, tree, event, rTree, rSubs, lstamp) {
  for (let key in subs) {
    item(key, target, subs, subs[key], update, tree, event, rTree, rSubs, lstamp)
  }
}

function item (key, target, pSubs, subs, update, tree, event, rTree, rSubs, force) {
  if (key !== 'val' && key !== '$') {
    if (key === '~') {
      root(target, pSubs, subs, update, tree, event, rTree, rSubs)
    } else if (key === '*') {
      collection(target, pSubs, subs, update, tree, event, rTree, rSubs, force)
    } else if (subs === true) {
      leaf(key, target, pSubs, update, tree, event, rTree, rSubs, force)
    } else {
      struct(key, target, pSubs, subs, update, tree, event, rTree, rSubs, force)
    }
  }
}

function leaf (key, target, subs, update, tree, event, rTree, rSubs, force) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    console.log('LEAF:', key)
    let stamp = generateStamp(keyTarget, treeKey, event, rTree, rSubs)
    if (!tree[key]) {
      tree[key] = stamp
      if (update) {
        update.call(keyTarget, INIT, event, subs, tree)
      }
    } else if ((force || treeKey) !== stamp) {
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

function struct (key, target, pSubs, subs, update, tree, event, rTree, rSubs, force) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.__input !== null) {
    let stamp = generateStamp(keyTarget, treeKey, event, rTree, rSubs)
    console.log('STRUCT:', key, subs, stamp, treeKey)
    if (!treeKey) {
      treeKey = tree[key] = { $: stamp }
      treeKey.$ = stamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, event, subs, treeKey)
      }
      diff(keyTarget, subs, update, treeKey, event, rTree, rSubs, force)
    } else if ((force || treeKey.$) !== stamp) {
      treeKey.$ = stamp
      if ((subs.val || subs['~']) && update) {
        update.call(keyTarget, UPDATE, event, subs, treeKey)
      }
      diff(keyTarget, subs, update, tree[key], event, rTree, rSubs, force)
    }
  } else if (treeKey) {
    if (update && (subs.val || subs['~'] || pSubs['*'])) {
      update.call(keyTarget, REMOVE, event, subs, treeKey)
    }
    delete tree[key]
  }
}

function collection (target, pSubs, subs, update, tree, event, rTree, rSubs, force) {
  if (target && target.__input !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        item(keys[i], target, pSubs, subs, update, tree, event, rTree, rSubs, force)
      }
    }
  } else if (tree && update) {
    update.call(target, REMOVE, event, subs, tree)
  }
}

function root (target, pSubs, subs, update, tree, event, rTree, rSubs) {
  if (!tree.$r) {
    tree.$r = subs
    let rTarget = target.getRoot()
    for (let key in subs) {
      let rTreeTarget = rTree[key]
      if (rTarget[key]) {
        let rSubsKey = subs[key]
        if (rSubsKey === true) {
          rSubsKey = subs[key] = { val: true }
        }
        if (!rTreeTarget) {
          rTreeTarget = rTree[key] = {}
        }
      }
    }
    composite(target, tree, update, event, ROOT, rTree, rSubs)
    tree.$ = generateStamp(target, tree, event, rTree, rSubs)
    if (update && tree.$r.$) {
      update.call(target, INIT, event, pSubs, tree)
    }
  }
}

// stamp handling / creation
function composite (target, tree, update, event, type, rTree, rSubs) {
  var path = target.syncPath
  var segment = rTree[path[0]]
  target = target.getRoot()[path[0]]
  for (let i = 0, len = path.length - 1; i < len; i++) {
    if (!segment.$c) {
      segment.$c = {}
    }
    let next = path[i + 1]
    if (segment.$c[next]) {
      if (segment.$c[next] !== type) {
        segment.$c[next] = [ segment.$c[next], type ]
        segment.$ = generateStamp(target, segment, event, rTree, rSubs)
      }
    } else {
      segment.$c[next] = type
      segment.$ = generateStamp(target, segment, event, rTree, rSubs)
    }
    segment = segment[next]
    target = target[next]
  }
}

function updateStamp (type, event, subs, tree) {
  subs.$ = tree.$
}

function rootStamp (target, tree, event, rTree, rSubs) {
  var subs = tree.$r
  var rstamp
  for (let skey in subs) {
    if (skey !== '$') {
      item(skey, target, subs, subs[skey], updateStamp, rTree, event, rTree, rSubs, tree.$r.$ || true)
      if (subs[skey].$) {
        if (!rstamp) {
          rstamp = subs[skey].$
        } else {
          rstamp += subs[skey].$
        }
      }
    }
  }
  if (rstamp) {
    subs.$ = rstamp
    return rstamp
  }
}

function generateStamp (target, tree, event, rTree, rSubs) {
  var stamp = target._lstamp
  console.log('  STAMP:', target.path.join('/'))
  if (tree) {
    if (tree.$r && tree.$r.$) {
      stamp += tree.$r.$
    }
    if (tree.$c) {
      let rTarget
      for (let key in tree.$c) {
        let cTree = tree[key]
        if (cTree.$r) {
          if (!rTarget) {
            rTarget = target.getRoot()
          }
          let rStamp = rootStamp(rTarget, cTree, event, rTree, rSubs)
          if (rStamp) { stamp += rStamp }
        }

        if (tree[key].$c) {
          // call same function
          console.log('#STAMP: nested composite -- lets go handle!', key)
        }
      }
    }
  }
  return stamp
}
