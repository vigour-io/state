'use strict'
const test = require('tape')
const subsTest = require('../test')
const logger = require('../log')

test('root - basic', function (t) {
  const state = require('../../s')
  const subscription = {
    a: {
      b: {
        $root: {
          $remove: true,
          b: { val: true, _: 'random information' }
        }
      }
    }
  }
  const s = subsTest(t, state({ a: { b: {} }, b: 'lullz' }, false), subscription, true)
  const r = s('initial subscription', [ { path: 'b', type: 'new' } ])
  s('create b', [ { path: 'b', type: 'update' } ], { b: 'hello b!' })
  s('update b', [ { path: 'b', type: 'update' } ], { b: 'hello b2!' })
  s('remove b', [ { path: 'b', type: 'remove' } ], { b: null })
  s('create b (again)', [ { path: 'b', type: 'new' } ], { b: 'hello b!' })
  s('remove a/b', [{ type: 'remove' }], { a: { b: null } })
  logger(r)
  t.end()
})

test.skip('root - basic - nested', function (t) {
  const subscription = {
    a: {
      $root: { b: { c: { d: { val: true } } } }
    }
  }
  const s = subsTest(t, { a: true }, subscription)
  s(
    'set b/c/d',
    [ { path: 'b/c/d', type: 'new', sType: 'root' } ],
    { b: { c: { d: 'its d!' } } }
  )
  t.end()
})

test.skip('root - basic - double', function (t) {
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
    { b: { c: {} }, c: 'hello c!' }
  )
  t.end()
})

test.skip('root - basic - multiple', function (t) {
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
  s('set b', [ { path: 'b', type: 'new', sType: 'root' } ], { b: 'hello b!' })
  s('set c', [ { path: 'c', type: 'new', sType: 'root' } ], { c: 'hello c!' })
  s('update c', [ { path: 'c', type: 'update', sType: 'root' } ], { c: 'hello c2!' })
  s('remove c', [ { path: 'c', type: 'remove', sType: 'root' } ], { c: null })
  t.end()
})

test.skip('root - basic - remove combined with normal', function (t) {
  const subscription = {
    b: { val: true },
    a: { $root: { b: { val: true } } }
  }
  const s = subsTest(t, { b: true, a: true }, subscription)
  console.log('REMOVE!')
  s('remove b', [
    { path: 'b', type: 'remove' },
    { path: 'b', type: 'remove', sType: 'root' }
  ], { b: null })
  t.end()
})

test.skip('root - basic - property', function (t) {
  const subscription = {
    b: { val: 1 },
    a: {
      $root: { b: { val: 1 } }
    }
  }
  const s = subsTest(t, {}, subscription)
  s('create b', [ { path: 'b', type: 'new' } ], false, { b: true })
  s('create a', [ { path: 'b', type: 'new', sType: 'root' } ], false, { a: true })
  s('update b', [], { b: 'update!' })
  console.log('REMOVE!')
  s('remove b', [
    { path: 'b', type: 'remove' },
    { path: 'b', type: 'remove', sType: 'root' }
  ], { b: null })
  t.end()
})
