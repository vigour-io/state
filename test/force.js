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
    console.log('update', state.path())
  })

  var forceObj = {
    [state.a.sid()]: true, // option to add stamp when nessecary
    [state.a.b.sid()]: true,
    [state.a.b.c.sid()]: true,
    [state.a.b.c.d.sid()]: true,
    [state.b.title.sid()]: true,
    [state.b.c.sid()]: true,
    [state.b.c.d.sid()]: true,
    [state.b.c.d.e.sid()]: true
  }

  for (var i = 0; i < 1e3; i++) {
    forceObj[i] = true
  }

  state.emit('subscription', forceObj)
  // now extra hard part
  // how to know which ONES to force
  // a good idea would be to check where there is a change btu the stamp is the same
  // in the set object
})
