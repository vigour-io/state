'use strict'
const item = require('./item')

module.exports = function (target, subs, update, tree, stamp) {
  const c = tree.$c
  for (let key in c) {
    if (tree[key] && subs[key]) {
      item(key, target, subs, subs[key], update, tree, stamp)
    }
  }
}
