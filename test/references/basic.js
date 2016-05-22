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
      a: {},
      b: {
        c: {
          d: '$root.a'
        }
      }
    },
    { b: { c: { d: { val: true } } } }
  )

  s(
    'initial subscription',
    [{ path: 'b/c/d', type: 'new' }]
  )

  s(
    'make a into a reference',
    [{ path: 'b/c/d', type: 'update' }],
    { a: '$root.x' }
  )

  s(
    'update x',
    [{ path: 'b/c/d', type: 'update' }],
    { x: 'hello its x' }
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
          c: { val: true, done: true, $remove: true }
        }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'a/b/c', type: 'new' },
      { path: 'a/b/c', type: 'new', sType: 'done' }
    ]
  )

  s(
    'switch reference',
    [
      { path: 'c/b/c', type: 'update' },
      { path: 'c/b/c', type: 'update', sType: 'done' }
    ],
    { b: '$root.c' }
  )

  s(
    'remove reference',
    [
      { type: 'remove' },
      { type: 'remove', sType: 'done' }
    ],
    { b: false }
  )
  t.end()
})
