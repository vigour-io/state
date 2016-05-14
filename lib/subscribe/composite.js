'use strict'
const item = require('./item')

module.exports = function (target, subs, update, tree, stamp) {
  const c = tree.$c
  for (let key in c) {
    if (key in tree) {
      if (key in subs) {
        item(key, target, subs, subs[key], update, tree, stamp)
      } else if ('$any' in subs) {
        item(key, target, subs, subs.$any, update, tree, stamp)
      }
    }
  }
}
