'use strict'
const item = require('./item')
const passCheck = /^\$pass/

module.exports = function (target, subs, update, tree, stamp) {
  var changed
  const c = tree.$c
  for (let key in c) {
    let s = subs
    if (key in tree) {

      // add $switch

      if (passCheck.test(key)) {
        s = s[key.replace('$pass', '$test')]
        if ('$pass' in s) {
          if (item(key, target, s.$pass, update, tree, stamp)) {
            changed = true
          }
        }
      } else {
        if (key in s) {
          if (item(key, target, s[key], update, tree, stamp)) {
            changed = true
          }
        }
      }
    }
  }
  return changed
}
