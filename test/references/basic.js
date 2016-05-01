'use strict'
const test = require('tape')
const subsTest = require('../test')

test('reference - basic', function (t) {
  const s = subsTest(
    t,
    { a: 'a', b: { ref: '$root.a' } },
    { b: { ref: true } }
  )

  s(
    'initial subscription',
    [{ path: 'b/ref', type: 'new' }],
    { b: { $: 1, ref: 1 } }
  )

  s(
    'referenced field origin',
    [{ path: 'b/ref', type: 'update' }],
    { b: { $: 2, ref: 2 } },
    { a: 'a-update' }
  )

  t.end()
})

test('reference - double', function (t) {
  const s = subsTest(
    t,
    {
      a: {},
      b: {
        c: {
          d: '$root.a'
        }
      }
    },
    { b: { c: { d: true } } }
  )

  s(
    'initial subscription',
    [{ path: 'b/c/d', type: 'new' }]
  )

  s(
    'make a into a reference',
    [{ path: 'b/c/d', type: 'update' }],
    false,
    { a: '$root.x' }
  )

  s(
    'update x',
    [{ path: 'b/c/d', type: 'update' }],
    false,
    { x: 'hello its x' }
  )

  t.end()
})

test('reference - nested', function (t) {
  const s = subsTest(
    t,
    {
      a: {
        b: {
          c: 'its c!'
        }
      },
      b: '$root.a'
    },
    { b: { b: { c: true } } }
  )

  s(
    'initial subscription',
    [{ path: 'a/b/c', type: 'new' }]
  )

  // dont think i want to fire for this -- its a bit of an edge case
  s(
    'remove reference',
    [{ path: 'a/b/c', type: 'remove-ref' }],
    { b: { $: 2 } },
    { b: false }
  )

  t.end()
})
