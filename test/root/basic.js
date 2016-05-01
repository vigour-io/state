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

test('root - basic - nested', function (t) {
  const subscription = {
    a: {
      $root: { b: { c: { d: true } } }
    }
  }
  const s = subsTest(t, { a: true }, subscription)
  s(
    'set b/c/d',
    [ { path: 'b/c/d', type: 'new', sType: 'root' } ],
    false,
    { b: { c: { d: 'its d!' } } }
  )
  t.end()
})

test('root - basic - double', function (t) {
  const subscription = {
    a: {
      $root: {
        b: {
          c: {
            $root: { c: true }
          }
        }
      }
    }
  }
  const s = subsTest(t, { a: true }, subscription)
  s(
    'set c',
    [ { path: 'c', type: 'update' } ],
    false,
    { b: { c: {} }, c: 'hello c!' }
  )
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
  s('set b', [ { path: 'b', type: 'new', sType: 'root' } ], false, { b: 'hello b!' })
  s('set c', [ { path: 'c', type: 'new', sType: 'root' } ], false, { c: 'hello c!' })
  s('update c', [ { path: 'c', type: 'update', sType: 'root' } ], false, { c: 'hello c2!' })
  t.end()
})
