'use strict'
const amount = 3e5

console.log('¯\\_(ツ)_/¯ lets make npm great again! --->', amount / 1000 + 'k')

global.cnt = 0

const Obs = require('vigour-observable')

// only store dynamic deps rest is bullshit anyways dont care, only to see if we can handle some load
const state = new Obs({
  child: {
    properties: {
      dependants: true,
      sha: true,
      url: true
    },
    version: {
      on: {
        data (val, stamp) {
          const obs = this.parent
          obs.emit('version', obs, stamp)
        }
      }
    },
    on: {
      version (obs, stamp) {
        global.cnt++
        if (this.vstamp !== stamp) {
          this.vstamp = stamp // means version stamp
          for (let i in this.dependants) {
            if (this.dependants[i].vstamp !== stamp) {
              this.dependants[i].emit('version', this, stamp)
            }
          }
        }
      }
    }
  }
}, false)

var time = Date.now()

for (let i = 0; i < amount; i++) {
  // ref some random modules
  // all using carrets for updates
 let key = 'moduleTimes' + i
  state.setKey(key, {
    version: 1,
    url: 'https://registry.npmjs.org/textextensions/-/textextensions-2.0.1.tgz',
    sha: 'be8cf22d65379c151319f88f0335ad8f667abdca'
  }, false)
  let target = state[key]
  if (!target.dependants) {
    target.dependants = {}
  }
  let deps = target.deps
  for (let j = 0; j < 20; j++) {
    let key = 'moduleTimes' + ((Math.random() * amount) | 0)
    let field = state[key] || state.get(key, {
      dependants: {}
    })
    field.dependants[key] = target
  }
}

console.log('done takes a while to init it....', Date.now() - time + 'ms')

var time = Date.now()
console.log('ok now rdy for some wicked update')
state['moduleTimes' + ((Math.random() * amount) | 0)].version.set(2)
console.log('update time', Date.now() - time + 'ms', 'updated:', global.cnt)
