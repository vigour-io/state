'use strict'

exports.define = {
  render (parent, state, tree, type) {
  }
}

function callit (elem, state, type, stamp, subs, tree, ptree, rtree) {
  if (type === 'remove') {
    if (tree._[elem.uid()]) {
      if (elem.__on.removeEmitter) {
        elem.__on.removeEmitter.emit(elem, stamp, tree._[elem.uid()])
      }
      tree._[elem.uid()].parentNode.removeChild(tree._[elem.uid()])
      delete tree._[elem.uid()]
    }
  } else {
    // console.warn('got render -->', elem.path().join('/'), elem.keys())
    if (!ptree._) {
      ptree._ = {}
    }
    if (!ptree._[elem.parent.uid()]) {
      // console.log('hello?', ptree)
      // do this in the while parent no state
      ptree._[elem.parent.uid()] = whileparentnostate(elem.parent, rtree, ptree)
    }
    let pnode = ptree._[elem.parent.uid()]

    if (!tree._) {
      tree._ = {}
    }

    if (elem.type === 'element') {
      if (!tree._[elem.uid()]) {
        // console.log('CREATE ELEMENT!', state.path(), pnode)
        let div = renderelem(elem)
        tree._[elem.uid()] = div
        pnode.appendChild(div)
      }
    } else {
      // hier moet de prop render stuff
      if (elem.key === 'text') {
        var val = state.compute()
        if (!tree._[elem.uid()]) {
          tree._[elem.uid()] = document.createTextNode(val)
          pnode.appendChild(tree._[elem.uid()])
        } else {
          tree._[elem.uid()].nodeValue = val
        }
      }
    }
  }
}

// if !tree._
exports.fn = function (state, type, stamp, subs, tree, ptree, rtree) {
  var elem = subs._
  if (!elem._base_version) {
    if (elem.$any) {
      elem = elem.$any
    }
  }
  if (elem instanceof Array) {
    for (var i in elem) {
      callit.call(this, elem[i], state, type, stamp, subs, tree, ptree, rtree)
    }
  } else {
    callit.call(this, elem, state, type, stamp, subs, tree, ptree, rtree)
  }
}

function renderelem (elem) {
  var div = document.createElement('div')
  if (elem.key || elem.css) {
    div.className = elem.css || elem.key
  }
  return div
}

function whileparentnostate (elem, rtree, ptree, holder) {
  var divelem
  var pelem
  while (elem && !elem.$ && !(ptree._ && ptree._[elem.uid()])) {
    let tdiv = renderelem(elem)
    if (!divelem) {
      divelem = tdiv
    }
    if (pelem) {
      tdiv.appendChild(pelem)
    }

    // not so nice but nessecary
    ptree._[elem.uid()] = tdiv

    let p = elem.parent
    if (p && ptree && ptree._[p.uid()]) {
      ptree._[p.uid()].appendChild(tdiv)
    }

    pelem = tdiv
    if (!elem.parent) {
      if (!rtree._) { rtree._ = {} }
      rtree._[elem.uid()] = tdiv
      elem = void 0
    } else {
      elem = elem.parent
    }
  }
  return divelem
}

// we want it on the tree!
  // root tree if ptree === rotree do somethign
// if ptree does not have node you know you have to make it
// also eed to check is this ptree node my real parent node -- need somekind of id
// in the _ we store the uids so you can easyly find it
