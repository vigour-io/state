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
  // create an event need it // or use char of not having one for init
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
    if (key === '$root') {
      root(target, pSubs, subs, update, tree, event, rTree, rSubs)
    } else if (key === '$any') {
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
    if (!treeKey) {
      treeKey = tree[key] = { $: stamp }
      treeKey.$ = stamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, event, subs, treeKey)
      }
      diff(keyTarget, subs, update, treeKey, event, rTree, rSubs, force)
    } else if ((force || treeKey.$) !== stamp) {
      treeKey.$ = stamp
      if ((subs.val || subs.$root) && update) {
        update.call(keyTarget, UPDATE, event, subs, treeKey)
      }
      diff(keyTarget, subs, update, tree[key], event, rTree, rSubs, force)
    }
  } else if (treeKey) {
    if (update && (subs.val || subs.$root || pSubs.$any)) {
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
    compositeRoot(target, tree, update, event, ROOT, rTree, rSubs)
    computeRoot(target, tree, event, rTree, rSubs)
    tree.$ = generateStamp(target, tree, event, rTree, rSubs)
    if (update && tree.$r.$) {
      update.call(target, INIT, event, pSubs, tree)
    }
  }
}

// stamp handling / creation
function compositeRoot (target, tree, update, event, type, rTree, rSubs) {
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
        // segment.$ = void 0 // generateStamp(target, segment, event, rTree, rSubs)
      }
    } else {
      segment.$c[next] = type
      // segment.$ = void 0 // generateStamp(target, segment, event, rTree, rSubs)
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

function computeRoot (target, cTree, event, rTree, rSubs, stamp) {
  var rTarget = target.getRoot() // optmize this
  let rStamp = rootStamp(rTarget, cTree, event, rTree, rSubs)
  if (rStamp) {
    if (!stamp) {
      stamp = rStamp
    } else {
      stamp += rStamp
    }
  }
  return stamp
}

function computeComposite (target, tree, event, rTree, rSubs) {
  if (tree.$c) {
    let estamp = (event && event.stamp)
    if (tree.$c.$ !== estamp) {
      let stamp
      tree.$c.$ = estamp
      for (let key in tree.$c) {
        if (key !== '$' && key !== '$$') {
          let cTree = tree[key]
          if (cTree.$r) {
            stamp = computeRoot(target, cTree, event, rTree, rSubs, stamp)
          }
          if (tree[key].$c) {
            let cStamp = computeComposite(target[key], tree[key], event, rTree, rSubs)
            if (cStamp) {
              if (!stamp) {
                stamp = cStamp
              } else {
                stamp += cStamp
              }
            }
          }
        }
      }
      // minor optmization check whats faster
      if (tree.$c.$ !== stamp) {
        tree.$c.$$ = stamp
      } else if (tree.$c.$$) {
        tree.$c.$$ = void 0
      }
      return stamp
    } else {
      return tree.$c.$$ || tree.$c.$
    }
  }
}

function generateStamp (target, tree, event, rTree, rSubs) {
  var stamp = target._lstamp
  // this function gets called to often on creation
  // console.log('     STAMP:', target.path.join('/'))
  if (tree) {
    if (tree.$r && tree.$r.$) {
      stamp += tree.$r.$
    }
    let cstamp = computeComposite(target, tree, event, rTree, rSubs)
    if (cstamp) {
      stamp += cstamp
    }
  }
  return stamp
}
