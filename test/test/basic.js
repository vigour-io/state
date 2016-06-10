'use strict'
const test = require('tape')
const subsTest = require('../util')

test('test - basic', function (t) {
  const subs = {
    letters: {
      $any: {
        $test: {
          exec (state) {
            return state.compute() === 'a'
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
    { path: 'letters/0', type: 'new' }
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

test('test - basic - root', function (t) {
  const subs = {
    x: {
      $test: {
        exec (state) {
          return state.compute() > 50
        },
        $pass: { $root: { bla: { val: true } } }
      }
    }
  }

  const state = { bla: true, x: 100 }
  const s = subsTest(t, state, subs)

  s('initial subscription', [
    { path: 'bla', type: 'new' }
  ])

  s(
    'change bla to false',
    [
      { path: 'bla', type: 'update' }
    ],
    { bla: false }
  )

  t.end()
})

test('test - basic - nested root', function (t) {
  const subs = {
    y: {
      $root: {
        x: {
          $test: {
            exec (state) {
              return state.compute() > 50
            },
            $pass: { val: true }
          }
        }
      }
    }
  }
  const state = { x: 100, y: {} }
  const s = subsTest(t, state, subs)
  s('initial subscription', [
    { path: 'x', type: 'new' }
  ])
  s(
    'change bla to false',
    [
      { path: 'x', type: 'remove' }
    ],
    { x: 50 }
  )
  t.end()
})
