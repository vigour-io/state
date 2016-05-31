'use strict'
const test = require('tape')
const subsTest = require('../util')

test('test - branch', function (t) {
  const subs = {
    letters: {
      $any: {
        $test1: {
          exec (state) {
            return state.compute() === 'a'
          },
          $pass: { val: true }
        },
        $test2: {
          exec (state) {
            return state.compute() === 'b'
          },
          $pass: { val: true }
        }
      }
    }
  }

  const state = {
    letters: [ 'a', 'b', 'c' ]
  }

  const s = subsTest(t, state, subs)

  s('initial subscription', [
    { path: 'letters/0', type: 'new' },
    { path: 'letters/1', type: 'new' }
  ])

  s(
    'change letters/2 to a',
    [
      { path: 'letters/2', type: 'new' }
    ],
    { letters: { 2: 'a' } }
  )

  t.end()
})
