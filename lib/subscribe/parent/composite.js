'use strict'

// module.exports = function addC (tree, type) {
//   var key = type
//   var parentcounter = 1
//   while (tree._p && parentcounter) {
//     if (tree._key !== type) {
//       // add both! -- difficult to combine
//       // have to do
//       if (!tree.$c) { tree.$c = {} }
//       tree.$c[key] = type
//       key = tree._key
//       tree = tree._p
//       if (key !== '$any') {
//         parentcounter--
//       }
//     } else {
//       parentcounter++
//       tree = tree._p
//     }
//   }
// }

module.exports = function addC (tree, type) {
  var key = type
  var parentcounter = 1
  // parentcounter -- ultra inefficient ofc -- but good temp fix -- this is the last thing
  // making sure reapplying / applying the $c works as expected -- this can be hard in cases of references
  // references have to resolve $c until the first common ancesotr --- usualy that is the root
  while (tree._p) {
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
