'use strict'
const item = require('./item')

module.exports = function (target, subs, update, tree, stamp, any, force) {
  var changed
  const c = tree.$c
  for (let key in c) {
    let s = subs
    if (key in tree) {
      if (/^\$pass/.test(key)) {
        s = s['$test' + key.slice(5)]
        if ('$pass' in s && item(key, target, s.$pass, update, tree, stamp, false, force)) {
          changed = true
        }
      } else {
        if ((any || key in s) && item(key, target, any ? s : s[key], update, tree, stamp, false, force)) {
          changed = true
        }
      }
    }
  }
  return changed
}
