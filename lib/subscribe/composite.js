'use strict'
const item = require('./item')

module.exports = function (target, subs, update, tree, stamp) {
  var changed
  const c = tree.$c
  for (let key in c) {
    if (key in tree) {
      if (key in subs) {
        if (item(key, target, subs[key], update, tree, stamp)) {
          changed = true
        }
      } else if ('$any' in subs) {
        if (item(key, target, subs.$any, update, tree, stamp)) {
          changed = true
        }
      }
    }
  }
  return changed
}
