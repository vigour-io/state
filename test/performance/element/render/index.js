'use strict'
const render = require('./method')
module.exports = function (type, stamp, subs, tree, ptree, rtree) {
  const target = subs._
  if (!target._base_version) {
    for (let uid in target) {
      render(target[uid], this, type, stamp, subs, tree, ptree, rtree)
    }
  } else {
    render(target, this, type, stamp, subs, tree, ptree, rtree)
  }
}
