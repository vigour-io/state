'use strict'
const test = require('tape')
const subsTest = require('../util')

test('reference - basic', function (t) {
  const s = subsTest(
    t,
    { a: 'a', b: { ref: '$root.a' } },
    { b: { ref: { val: true } } }
  )

  s(
    'initial subscription',
    [{ path: 'b/ref', type: 'new' }]
  )

  s(
    'referenced field origin',
    [{ path: 'b/ref', type: 'update' }],
    { a: 'a-update' }
  )

  t.end()
})

test('reference - double', function (t) {
  const s = subsTest(
    t,
    {
      a: 'a',
      c: 'c',
      b: { ref: '$root.a' }
    },
    { b: { ref: { val: 1 } } }
  )

  s(
    'initial subscription',
    [{ path: 'b/ref', type: 'new' }]
  )

  s(
    'referenced field origin',
    [],
    { a: 'a-update' }
  )

  s(
    'change reference',
    [{ path: 'b/ref', type: 'update' }],
    { b: { ref: '$root.c' } }
  )

  t.end()
})

test('reference - nested', function (t) {
  const s = subsTest(
    t,
    {
      a: { b: { c: 'its a.b.c!' } },
      c: { b: { c: 'its c.b.c!' } },
      b: '$root.a'
    },
    {
      b: {
        $remove: true,
        b: {
          $remove: true,
          c: { val: true, $remove: true }
        }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'a/b/c', type: 'new' }
    ]
  )

  s(
    'switch reference',
    [
      { path: 'c/b/c', type: 'update' }
    ],
    { b: '$root.c' }
  )

  s(
    'remove reference',
    [
      { type: 'remove' }
    ],
    { b: false }
  )
  t.end()
})
