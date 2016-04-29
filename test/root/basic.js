'use strict'
const test = require('tape')
const subsTest = require('../test')

test('root - basic', function (t) {
  const subscription = {
    a: {
      $root: {
        b: { val: true }
      }
    }
  }
  const s = subsTest(t, { a: true }, subscription)
  s('set b', [ { path: 'b', type: 'new' } ], false, { b: 'hello b!' })
  t.end()
})

test('root - basic - multiple', function (t) {
  const subscription = {
    a: {
      $root: {
        c: { val: true },
        b: { val: true }
      }
    }
  }
  const s = subsTest(t, { a: true }, subscription)
  s('initial subscription', [])
  s('set b', [ { path: 'b', type: 'new' } ], false, { b: 'hello b!' })
  s('set c', [ { path: 'c', type: 'new' } ], false, { c: 'hello c!' })
  s('update c', [ { path: 'c', type: 'update' } ], false, { c: 'hello c2!' })
  t.end()
})
