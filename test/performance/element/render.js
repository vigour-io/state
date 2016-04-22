'use strict'

exports.define = {
  render (parent, state, tree, type) {
  }
}

// if !tree._
exports.fn = function (state, type, stamp, subs, tree, ptree, rtree) {
  var elem = subs._
  // console.log(ptree)
  if (!elem._base_version) {
    if (elem.$any) {
      elem = elem.$any
    } else {
      throw new Error('weirdness going on render', elem)
    }
  }

  // console.warn('got render -->', elem.path().join('/'), elem.keys())

  if (!ptree._) {
    ptree._ = {}
  }
  if (!ptree._[elem._parent.uid()]) {
    // console.error('CREATE PNODE', elem.path())
    if (!elem.parent.$) {
      ptree._[elem._parent.uid()] = whileparentnostate(elem._parent, rtree, ptree)
    }
  }
  let pnode = ptree._[elem._parent.uid()]
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
    if (elem.key === 'text') {
      if (!tree._[elem.uid()]) {
        tree._[elem.uid()] = document.createTextNode(state.compute())
        pnode.appendChild(tree._[elem.uid()])
      } else {
        tree._[elem.uid()].nodeValue = state.compute()
      }
    }
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

    let p = elem.parent
    if (p && ptree && ptree._[p.uid()]) {
      // console.log('very special -- need more level')
      ptree._[p.uid()].appendChild(tdiv)
    } else {
      // console.error('\n\nHERE HERE HERE WRONG!', elem.path().join('/'))
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
