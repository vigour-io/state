'use strict'
const item = require('../item')

//composite(traveltarget, subs, update, tree[key], stamp)

//module.exports = function item (key, target, pSubs, subs, update, tree, stamp) {
module.exports = function (target, subs, update, tree, stamp) {
  const c = tree.$c
  console.log('make', c)
  for (let key in c) {
    if (tree[key] && subs[key]) {
      //key, target, pSubs, subs, update, tree, stamp
      item(key, target, subs, subs[key], update, tree, stamp)
    }
  }
}
