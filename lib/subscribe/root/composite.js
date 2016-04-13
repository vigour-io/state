'use strict'
module.exports = function compositeRoot (target, tree, update, stamp, type, rTree, rSubs) {
  // only for root useless for the rest
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
