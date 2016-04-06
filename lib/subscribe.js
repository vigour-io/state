'use strict'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const ROOT = 'root'

module.exports = function (target, subs, update, tree) {
  if (!tree) { tree = {} }
  target.on('subscription', function (data, stamp) {
    diff(target, subs, update, tree, stamp, tree, subs)
  })
  target._subscriptions = true
  // create a stamp need it // or use char of not having one for init
  diff(target, subs, update, tree, void 0, tree, subs)
  return tree
}

function diff (target, subs, update, tree, stamp, rTree, rSubs, lstamp) {
  for (let key in subs) {
    item(key, target, subs, subs[key], update, tree, stamp, rTree, rSubs, lstamp)
  }
}

function item (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (key !== 'val' && key !== '$') {
    if (key === '$root') {
      root(target, pSubs, subs, update, tree, stamp, rTree, rSubs)
    } else if (key === '$any') {
      collection(target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    } else if (subs === true) {
      leaf(key, target, pSubs, update, tree, stamp, rTree, rSubs, force)
    } else {
      struct(key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
    }
  }
}

function leaf (key, target, subs, update, tree, stamp, rTree, rSubs, force) {
  var keyTarget = target[key]
  var treeKey = tree[key]
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs)
    if (!tree[key]) {
      tree[key] = leafStamp
      if (update) {
        update.call(keyTarget, INIT, stamp, subs, tree)
      }
    } else if ((force || treeKey) !== leafStamp) {
      tree[key] = leafStamp
      if (update) {
        update.call(keyTarget, UPDATE, stamp, subs, tree)
      }
    }
  } else if (treeKey) {
    if (update) {
      update.call(keyTarget, REMOVE, stamp, subs, tree)
    }
    delete tree[key]
  }
}

function struct (key, target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  var keyTarget = target[key]
  var treeKey = tree[key]

  // listeners fire but does not exist yet --- makes total sense of course
  if (keyTarget && keyTarget.val !== null) {
    let leafStamp = generateStamp(keyTarget, treeKey, stamp, rTree, rSubs)
    if (!treeKey) {
      treeKey = tree[key] = { $: leafStamp }
      treeKey.$ = leafStamp
      if ((subs.val) && update) {
        update.call(keyTarget, INIT, stamp, subs, treeKey)
      }
      diff(keyTarget, subs, update, treeKey, stamp, rTree, rSubs, force)
    } else if ((force || treeKey.$) !== leafStamp) {
      treeKey.$ = leafStamp
      if ((subs.val || subs.$root) && update) {
        update.call(keyTarget, UPDATE, stamp, subs, treeKey)
      }
      diff(keyTarget, subs, update, tree[key], stamp, rTree, rSubs, force)
    }
  } else if (treeKey) {
    if (update && (subs.val || subs.$root || pSubs.$any)) {
      update.call(keyTarget, REMOVE, stamp, subs, treeKey)
    }
    delete tree[key]
  }
}

function collection (target, pSubs, subs, update, tree, stamp, rTree, rSubs, force) {
  if (target && target.val !== null) {
    let keys = target.keys()
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        item(keys[i], target, pSubs, subs, update, tree, stamp, rTree, rSubs, force)
      }
    }
  } else if (tree && update) {
    update.call(target, REMOVE, stamp, subs, tree)
  }
}

function root (target, pSubs, subs, update, tree, stamp, rTree, rSubs) {
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
    compositeRoot(target, tree, update, stamp, ROOT, rTree, rSubs)
    computeRoot(target, tree, stamp, rTree, rSubs)
    tree.$ = generateStamp(target, tree, stamp, rTree, rSubs)
    if (update && tree.$r.$) {
      update.call(target, INIT, stamp, pSubs, tree)
    }
  }
}

// stamp handling / creation
function compositeRoot (target, tree, update, stamp, type, rTree, rSubs) {
  var path = target.realPath(false, true)
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
      }
    } else {
      segment.$c[next] = type
    }
    segment = segment[next]
    target = target[next]
  }
}

function updateStamp (type, stamp, subs, tree) {
  subs.$ = tree.$
}

function rootStamp (target, tree, stamp, rTree, rSubs) {
  var subs = tree.$r
  var rstamp
  for (let skey in subs) {
    if (skey !== '$') {
      item(skey, target, subs, subs[skey], updateStamp, rTree, stamp, rTree, rSubs, tree.$r.$ || true)
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

function computeRoot (target, cTree, event, rTree, rSubs, istamp) {
  var rTarget = target.getRoot() // optmize this
  let rStamp = rootStamp(rTarget, cTree, event, rTree, rSubs)
  if (rStamp) {
    if (!istamp) {
      istamp = rStamp
    } else {
      istamp += rStamp
    }
  }
  return istamp
}

function computeComposite (target, tree, stamp, rTree, rSubs) {
  if (tree.$c) {
    if (tree.$c.$ !== stamp) {
      let istamp
      tree.$c.$ = stamp
      for (let key in tree.$c) {
        if (key !== '$' && key !== '$$') {
          let cTree = tree[key]
          if (cTree.$r) {
            istamp = computeRoot(target, cTree, stamp, rTree, rSubs, istamp)
          }
          if (tree[key].$c) {
            let cStamp = computeComposite(target[key], tree[key], stamp, rTree, rSubs)
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

function generateStamp (target, tree, stamp, rTree, rSubs) {
  var lstamp = target._lstamp
  // console.log('     STAMP:', target.path.join('/'))
  if (tree) {
    if (tree.$r && tree.$r.$) {
      lstamp += tree.$r.$
    }
    let cstamp = computeComposite(target, tree, stamp, rTree, rSubs)
    if (cstamp) {
      lstamp += cstamp
    }
  }
  return lstamp
}
