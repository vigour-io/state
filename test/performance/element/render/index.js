'use strict'

exports.define = {
  render (parent, state, tree, type) {
    // this will get the true render -- need something for properties as well
    // need to get somethign to change this up easyly -- nice to start with canvas for example
    // need to do something about types then but all doable
    // then some nice util convert to html and convert from html (using as much standard stuff as possible)
    // then convert to hyperscript
    // events
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
      // need psubs!
      ptree._ = {}
    }

    if (!ptree._[elem.parent.uid()]) {
      // console.info('ptree', ptree._)
      // do this in the while parent no state
      ptree._[elem.parent.uid()] = whileparentnostate(elem.parent, rtree, ptree)
    }
    let pnode = ptree._[elem.parent.uid()]

    if (!tree._) {
      tree._ = {}
    }

    if (elem.type === 'element') {
      if (!tree._[elem.uid()]) {
        // console.log('CREATE ELEMENT!', state.path(), pnode, elem.parent)
        let div = renderelem(elem)
        tree._[elem.uid()] = div
        pnode.appendChild(div)
      }
    } else {
      // hier moet de prop render stuff
      if (elem.key === 'text') {
        // elem.compute cna be checked if nessecary
        var val = elem.compute(state.compute())

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
    for (var i in elem) {
      callit.call(this, elem[i], state, type, stamp, subs, tree, ptree, rtree)
    }
  } else {
    callit.call(this, elem, state, type, stamp, subs, tree, ptree, rtree)
  }
}

function renderelem (elem) {
  // order!!!! very important
  var nostate = elem.noState
  var div
  // add types
  if (nostate && elem._cachedNode) {
    // this can leak memmory for non-repeating things -- then its a waste
    div = elem._cachedNode.cloneNode(true)
  } else {
    div = document.createElement('div')
    let nostates = elem._noState !== void 0 ? elem._noState : elem.keys('_noState', function (val, key) {
      return val[key] && val[key].noState
    })
    if (elem.key || elem.css) {
      div.className = elem.css || elem.key // not correct yet
    }
    if (nostates) {
      for (var i in nostates) {
        if (elem[nostates[i]].type === 'element') {
          div.appendChild(renderelem(elem[nostates[i]], true))
        }
      }
    }
    if (nostate) {
      elem._cachedNode = div
    }
  }
  // do all the non state props as well
  return div
}

// this goes away
function finduid (p, uid) {
  while (p) {
    if (p._[uid]) {
      return p._[uid]
    }
    p = p._parent
  }
}

// doing this from the state update results in a lot of weird things
// menu that does not get rendered etc

// this goes away -- lets start with the travelers
function whileparentnostate (elem, rtree, ptree, holder) {
  var divelem
  var pelem

  // need to have it in the subs
  // ptree = finduid(ptree)

  // ptree._[elem.uid()])

  while (elem && !elem.$) {
    if (ptree._ && finduid(ptree, elem.uid())) {
      if (pelem) {
        finduid(ptree, elem.uid()).appendChild(pelem)
      }
      elem = void 0
    } else {
      let tdiv = renderelem(elem)
      if (!divelem) {
        divelem = tdiv
      }
      if (pelem) {
        // ptree is not enough need to find it higher up :/
        // this is shit but its the problem
        // we try to add this piece to the wrong tree
        // of course the ptree "title" will not have these motherfuckers
        // how to know where to find them?
        // console.log('CREATE', tdiv, pelem, elem.uid(), ptree, ptree._[elem.uid()])
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
  }
  return divelem
}

// we want it on the tree!
  // root tree if ptree === rootree do somethign
// if ptree does not have node you know you have to make it
// also eed to check is this ptree node my real parent node -- need somekind of id
// in the _ we store the uids so you can easyly find it
