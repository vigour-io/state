'use strict'
// needs perf optmization
exports.define = {
  resubscribe (stamp) {
    const emitters = this.emitters
    if (
      this.hasOwnProperty('_emitters') &&
      (
        emitters.hasOwnProperty('subscription') ||
        emitters.hasOwnProperty('_subscription')
      )
    ) {
      const subs = emitters.subscription
      const fn = subs.hasOwnProperty('fn') && subs.fn
      const attach = subs.hasOwnProperty('attach') && subs.attach
      if (fn) {
        fn.each((prop, key) => {
          if (fn.hasOwnProperty(key)) {
            walkTree(prop.tree)
          }
        })
      }
      if (attach) {
        attach.each((prop, key) => {
          if (attach.hasOwnProperty(key)) {
            prop = prop[0]
            walkTree(prop.tree)
          }
        })
      }
      this.emit('subscription', void 0, stamp)
    }
  }
}

function walkTree (tree) {
  for (let key in tree) {
    if (key === '$') {
      delete tree[key]
    } else if (typeof tree[key] === 'object') {
      if (key[0] !== '_') {
        walkTree(tree[key])
      }
    }
  }
}
