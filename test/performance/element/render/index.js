'use strict'
exports.multiple = function (type, stamp, subs, tree, ptree, rtree) {
  const target = subs._
  if (!target._base_version) {
    for (let uid in target) {
      render(target[uid], this, type, stamp, subs, tree, ptree, rtree)
    }
  } else {
    render(target, this, type, stamp, subs, tree, ptree, rtree)
  }
}

exports.single = render

function render (target, state, type, stamp, subs, tree, ptree, rtree) {
  if (type === 'remove') {
    if (target.__on.removeEmitter) {
      target.__on.removeEmitter.emit(target, stamp, tree._ && tree._[target.uid()])
    }
  } else if (!tree._) {
    tree._ = {}
  }
  return target.render(state, type, stamp, subs, tree, ptree, rtree)
}
