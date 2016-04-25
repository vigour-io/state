'use strict'
module.exports = function (target, state, type, stamp, subs, tree, ptree, rtree) {
  if (type === 'remove') {
    if (target.__on.removeEmitter) {
      target.__on.removeEmitter.emit(target, stamp, tree._ && tree._[target.uid()])
    }
  } else {
    if (!tree._) { tree._ = {} }
  }
  return target.render(state, type, stamp, subs, tree, ptree, rtree)
}
