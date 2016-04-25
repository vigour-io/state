'use strict'
const getParentNode = require('./parent')

// order!!!! very important
function renderElement (uid, elem, type, stamp, subs, tree, ptree, rtree) {
  const nostate = elem.noState
  var div
  if (nostate && elem._cachedNode) {
    div = tree._[uid] = elem._cachedNode.cloneNode(true)
  } else {
    div = tree._[uid] = document.createElement('div') // nodeType, also can do a clone much faster
    div.className = elem.key
    // -------- find a way to reuse this --------
    let nostates = elem._noStates !== void 0
      ? elem._noStates : elem.keys('_noStates', noStateElement)
    if (nostates) {
      for (let i in nostates) {
        elem[nostates[i]].render(void 0, type, stamp, subs, tree, ptree, rtree, div)
      }
    }
    // -------- how to reuse ------------------

    if (nostate || nostates) {
      elem._cachedNode = div
    }
  }
  return div
}

function noStateElement (val, key) {
  const target = val[key]
  return target && target.noState
}

module.exports = function createElement (uid, target, state, type, stamp, subs, tree, ptree, rtree, pnode) {
  const domNode = renderElement(uid, target, type, stamp, subs, tree, ptree, rtree)
  pnode = pnode || getParentNode(uid, target, state, type, stamp, subs, tree, ptree, rtree)
  if (pnode) {
    pnode.appendChild(domNode)
  } else {
    console.warn('no pnode must be the app', target.path())
  }
  return domNode
}
