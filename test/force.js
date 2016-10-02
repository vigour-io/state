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
  const arr = []
  // make it with switch instant
  state.subscribe({
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
    arr.push(state.path())
    // console.log('update',
  })

  // allow array transformer maybe -- its a lot nicer

  var forceObj = {
    [state.a.sid()]: true, // option to add stamp when nessecary -- maybe clean
    [state.a.b.sid()]: true,
    [state.a.b.c.sid()]: true,
    [state.a.b.c.d.sid()]: true,
    [state.b.title.sid()]: true,
    [state.b.c.sid()]: true,
    [state.b.c.d.sid()]: true,
    [state.b.c.d.e.sid()]: true
  }
  state.emit('subscription', forceObj)
  t.same(arr, [
    [ 'b', 'title' ],
    [ 'b', 'c', 'd', 'e' ],
    [ 'b', 'title' ],
    [ 'b', 'c', 'd', 'e' ]
  ])
  t.end()
})
