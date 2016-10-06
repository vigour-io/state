'use strict'
module.exports = (target, subs, tree, key) => {
  if (target.compute()) {
    const path = target.path()
    var eligable, level, length

    for (let field in subs) {
      if (field[0] !== '$') {
        if (!length) { length = path.length }
        const glob = field.split('.')
        const l = glob.length
        if (length >= l) {
          if (!level || l >= level) {
            const delta = length - l
            let score = 0
            for (let i = l - 1, weight = 2; i >= 0; i--) {
              const key = glob[i]
              weight++
              if (key === path[i + delta]) {
                score += weight
              } else if (key === '*') {
                score += 1
              } else {
                score = false
                break
              }
            }
            if (score) {
              if (!eligable) { eligable = [] }
              if (!(l in eligable)) { eligable[l] = [] }
              eligable[l][score] = field
              level = l
            }
          }
        }
      }
    }

    if (eligable) {
      const candidates = eligable[level]
      return candidates[candidates.length - 1]
    }
  }
}
