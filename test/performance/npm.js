'use strict'
const amount = 3e5

console.log('¯\\_(ツ)_/¯ lets make npm great again! --->', amount/ 1000 + 'k')


// only store dynamic deps rest is bullshit anyways
const s = require('../../s')
const state = s({
  child: {
    properties: {
      deps: true,
      dependants: true
    },
    on: {
      version () {
        console.log('ha update bitchez', this.path())
      }
    }
  }
})

var time = Date.now()

for (let i = 0; i < amount; i++) {
  // ref some random modules
  // all using carrets for updates
 let key = 'moduleTimes' + i
  state.setKey(key, {
    deps: [],
    version: 1
  }, false)
  let target = state[key]
  if (!target.dependants) {
    target.dependants = []
  }
  let deps = target.deps
  for (let j = 0; j < 10; j++) {
    let field = state.get('moduleTimes' + ((Math.random() * amount) | 0), {
      dependants: []
    })
    field.dependants.push(target)
    deps.push(field)
  }
}

console.log('ok got a dirty cache make into state')
console.log('done takes a while to init it....', Date.now() - time + 'ms')

// module.exports = function (target, subs, update, tree, stamp, attach, id) {

state.subscribe({
  $any: {
    version: {
      val: true
    }
  }
}, (state, tree, stamp) => {
  if (stamp) {
    state = state._parent
    state.emit('version', state, stamp)
    for (let i = 0, len = state.dependants.length; i < len; i++) {
      state.dependants[i].emit('version', state, stamp)
    }
  }
}, false, false)
// second argument is stamp sort of a thing that i send for updates

var time = Date.now()
console.log('ok now rdy for some wicked update')
state['moduleTimes' + ((Math.random() * amount) | 0)].version.set(2)
console.log('update time', Date.now() - time + 'ms')
