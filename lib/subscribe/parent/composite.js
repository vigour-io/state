'use strict'

module.exports = function addC (tree, type) {
  var key = type
  var parentcounter = 1
  while (tree._p && parentcounter) {
    if (tree._key !== type) {
      // add both! -- difficult to combine
      // have to do
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = type
      key = tree._key
      tree = tree._p
      if (key !== '$any') {
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}

/*
function composite (tree, type) {
  var key = type
  var parentcounter = 1
  while (tree._p) {
    if (tree._key !== type) {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = type
      key = tree._key
      tree = tree._p
      if (key !== '$any') {
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}
*/
