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
    [state.a.sid() + state.a.stamp]: true,
    [state.a.b.sid() + state.a.stamp]: true,
    [state.a.b.c.sid() + state.a.stamp]: true,
    [state.a.b.c.d.sid() + state.a.stamp]: true,
    [state.b.title.sid() + state.a.stamp]: true,
    [state.b.c.sid() + state.a.stamp]: true,
    [state.b.c.d.sid() + state.a.stamp]: true,
    [state.b.c.d.e.sid() + state.a.stamp]: true
  }

  // for (var i = 0; i < 1e3; i++) {
  //   forceObj[i] = true
  // }

  // for (var i = 0; i < 1e3; i++) {
  //   force.push((Math.random() * 1000000) | 0)
  // }

  console.log(force)

  state.emit('subscription', forceObj)

  function f (leafStamp, val) {
    return val[leafStamp]
  }

  force.sort()
  function arr (leafStamp, val) {
    // start in middle
    for (let i = 0, len = val.length; i < len && leafStamp < val[i + 1]; i++) {
      if (val[i] === leafStamp) {
        return true
      }
    }
  }


  // const f = require('../lib/subscribe/force')
  var d = Date.now()
  for (let i = 0; i < 1e5; i++) {
    f(123213123, forceObj)  // false
  }
  console.log('falsy', Date.now() - d, 'ms')


  var d = Date.now()
  for (let i = 0; i < 1e5; i++) {
    arr(15236, force)  // false
  }
  console.log('arr falsy', Date.now() - d, 'ms')

  var d = Date.now()
  for (let i = 0; i < 1e5; i++) {
    f(state.b.title.sid() + state.a.stamp, forceObj)  // false
  }
  console.log('find', Date.now() - d, 'ms')

  var d = Date.now()
  for (let i = 0; i < 1e5; i++) {
    arr(state.b.title.sid(), force)  // false
  }
  console.log('find arr', Date.now() - d, 'ms')


  // state.on('x', () => {})

  // var d = Date.now()
  // for (let i = 0; i < 1e5; i++) {
  //   // state.emit('x', forceObj)
  //   state.emit('subscription')
  //   // state.emit('subscription', forceObj)
  // }
  // console.log(Date.now() - d, 'ms')
})
