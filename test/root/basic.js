'use strict'
const test = require('tape')
const subsTest = require('../test')

test('root - basic', function (t) {
  const state = require('../../s')
  const subscription = {
    a: {
      $root: {
        b: { val: true, _: 'random information' }
      }
    }
  }
  const s = subsTest(t, state({ a: true }, false), subscription)
  s('create b', [ { path: 'b', type: 'new' } ], false, { b: 'hello b!' })
  s('update b', [ { path: 'b', type: 'update' } ], false, { b: 'hello b2!' })
  s('remove b', [ { path: 'b', type: 'remove' } ], false, { b: null })
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
    [ { path: 'c', type: 'new' } ],
    false,
    { b: { c: {} }, c: 'hello c!' }
  )
  t.end()
})

test('root - basic - property', function (t) {
  const subscription = {
    b: { val: 1 },
    a: {
      $root: {
        b: { val: 1 } // this is a shame
      }
    }
  }
  const s = subsTest(t, {}, subscription)
  s('create b', [ { path: 'b', type: 'new' } ], false, { b: true })
  s('create a', [ { path: 'b', type: 'new' } ], false, { a: true })
  s('update b', [], false, { b: 'update!' })
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
  s('remove c', [ { path: 'c', type: 'remove', sType: 'root' } ], false, { c: null })
  t.end()
})
