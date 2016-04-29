'use strict'
const test = require('tape')

test('root - basic', function (t) {
  t.plan(2)
  const State = require('../../lib')
  const s = new State({
    key: 'ROOT',
    a: true
  })
  s.subscribe({
    a: {
      $root: {
        b: { val: true }
      }
    }
  }, function (state, type, stamp, subs, tree) {
    t.equal(state.path().join('/'), 'ROOT/b', 'correct state')
    t.equal(type, 'new', 'correct type')
  })
  s.set({ b: 'hello b!' })
})

test('root - basic - multiple', function (t) {
  const subsTest = require('../test')
  const subscription = {
    a: {
      $root: {
        c: { val: true },
        b: { val: true }
      }
    }
  }
  const s = subsTest(t, { a: true }, subscription)
  t.plan(2)
  s('initial subscription', [])
  s('set b', [ { path: 'b', type: 'new' } ], false, { b: 'hello b!' })
  s('set c', [ { path: 'c', type: 'new' } ], false, { c: 'hello c!' })
  console.log('------------------------- \nupdate c --- here it goes wrong!')
  s('update c', [ { path: 'c', type: 'update' } ], false, { c: 'hello c2!' })
  t.end()
})
