'use strict'
const getParentNode = require('./parent')

// order!!!! very important
function renderElement (uid, elem, type, stamp, subs, tree, ptree, rtree) {
  const nostate = elem.noState
  var div
  // need to null on new -- else problems of course...
  if (nostate && elem._cachedNode) {
    div = tree._[uid] = elem._cachedNode.cloneNode(true)
  } else {
    // nodeType, also can do a clone much faster
    let nostates = elem._noStates !== void 0
      ? elem._noStates : elem.keys('_noStates', noStateElement)
    if (elem._cachedNode) {
      div = tree._[uid] = elem._cachedNode.cloneNode()
    } else {
      let nostatesproperties = elem._noStatesP !== void 0
      ? elem._noStatesP : elem.keys('_noStatesP', noStateProperty)
      div = tree._[uid] = document.createElement('div')
      // -------- find a way to reuse this --------
      if (nostatesproperties) {
        for (let i in nostatesproperties) {
          elem[nostatesproperties[i]].render(void 0, type, stamp, subs, tree, ptree, rtree, div)
        }
      }
      // -------- how to reuse ------------------
      if (nostate || nostatesproperties) {
        elem._cachedNode = div
      }
    }

    if (nostates) {
      for (let i in nostates) {
        elem[nostates[i]].render(void 0, type, stamp, subs, tree, ptree, rtree, div)
      }
    }
  }
  return div
}

function noStateProperty (val, key) {
  const target = val[key]
  return target && target.noState && !target.isElement
}

function noStateElement (val, key) {
  const target = val[key]
  return target && target.noState && target.isElement
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
