'use strict'
const test = require('tape')
const State = require('../')
const log = require('./util/log')

test('force - basic', (t) => {
  const state = new State({
    a: {
      b: {
        c: {
          d: '$root.b'
        }
      }
    },
    b: {
      title: 'its b',
      c: {
        d: {
          e: 'its e'
        }
      }
    }
  })

  // make it with switch instant

  const tree = state.subscribe({
    a: {
      b: {
        c: {
          d: {
            title: { val: true },
            c: {
              d: {
                e: { val: true }
              }
            }
          }
          // test with nested
        }
      }
    }
  }, state => {
    // console.log('update', state.path())
  })

  console.log(log(tree))
  // make force generator
  // so we send
  // maybe index of
  // even faster make indeces
  // just array could be faster mostly force is not soo much
  // 2 things do it specific -- OR -- do it deep
  // specific maybe a bit heavy
  // pretty big lists

  console.log(' \nDO IT DO IT')

  // generator for these thigns as well!
  var force = [
    state.a.sid(),
    state.a.b.sid(),
    state.a.b.c.sid(),
    state.b.title.sid(),
    state.b.c.sid(),
    state.b.c.d.sid(),
    state.b.c.d.e.sid()
  ]

  var forceObj = {
    [state.a.sid()]: state.stamp,
    [state.a.b.sid()]: state.stamp,
    [state.a.b.c.sid()]: state.stamp,
    [state.a.b.c.d.sid()]: state.stamp,
    [state.b.title.sid()]: state.stamp,
    [state.b.c.sid()]: state.stamp,
    [state.b.c.d.sid()]: state.stamp,
    [state.b.c.d.e.sid()]: state.stamp
  }

  for (var i = 0; i < 1e3; i++) {
    forceObj[i] = true
  }

  state.emit('subscription', forceObj)

  function f (leafStamp, val) {
    return val[leafStamp]
  }

  function f2 (sid, stamp, val) {
    // do we need -- stamp ?
    return val[sid] === stamp
  }

  // const f = require('../lib/subscribe/force')
  var d = Date.now()
  for (let i = 0; i < 1e6; i++) {
    f2(state.b.title.sid(), state.a.stamp, forceObj)  // false
  }
  console.log('find', Date.now() - d, 'ms')

  // for (let i = 0; i < 1e6; i++) {
  //   f(state.b.title.sid(), state.a.stamp, forceObj)  // false
  // }
})
