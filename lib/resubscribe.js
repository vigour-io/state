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
            for (let i in prop.tree) {
              delete prop.tree[i]
            }
          }
        })
      }
      if (attach) {
        attach.each((prop, key) => {
          if (attach.hasOwnProperty(key)) {
            prop = prop[0]
            for (let i in prop.tree) {
              delete prop.tree[i]
            }
          }
        })
      }
      this.emit('subscription', void 0, stamp)
    }
  }
}
