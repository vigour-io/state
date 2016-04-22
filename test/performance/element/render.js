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
      console.warn('got any', elem, state.inspect())
      elem = elem.$any
    } else {
      throw new Error('weirdness going on render', elem)
    }
    // need to create stuff prob...
  } else { // TEMP FOR DEBUGS

    if (elem.type === 'element') {
      console.warn('got element -->', elem.inspect(), elem.path().join('/'))
      if (!ptree._) {
        ptree._ = {}
        if (!ptree._[elem.parent.uid()]) {
          if (!elem.parent.$) {
            console.error('need to create this stuff!')
            ptree._[elem.parent.uid()] = whileparentnostate(elem.parent, rtree)
          }
        }
      }
      let pnode = ptree._[elem.parent.uid()]
    } else {
      console.info('prop or somethin', elem.inspect())
    }
  }
}

function whileparentnostate (elem, rtree) {
  var divelem
  var pelem
  while (elem) {
    let tdiv = document.createElement('div')
    if (!divelem) {
      divelem = tdiv
    }
    if (pelem) {
      tdiv.appendChild(pelem)
    }
    tdiv.className = elem.key
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
