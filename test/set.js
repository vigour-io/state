'use strict'
const test = require('tape')
const subsTest = require('./util')
const s = require('../s')
test('set', function (t) {
  t.plan(1)
  const state = s({
    key: 'state',
    hello: {
      bye: {
        yes: '$root.bla.bla'
      }
    }
  })

  subsTest(
    t,
    state,
    {
      hello: {
        hello: {
          bye: { val: true }
        },
        $test: {
          exec (state, tree) {
            if (state.get('premium')) {
              t.equal(state.premium.compute(), 'its premium!', 'fires test, has premium')
            }
            return true
          },
          $pass: {
            val: true
          }
        }
      }
    }
  )

  state.set({
    bla: {
      bla: 'yo!'
    },
    hello: {
      bye: {
        bye: {
          hello: 'yes!'
        }
      },
      no: 'way',
      premium: 'its premium!'
    }
  })
})
