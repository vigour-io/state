'use strict'
const test = require('tape')
const subsTest = require('../test')

test('reference - basic', function (t) {
  const s = subsTest(
    t,
    { a: 'a', b: { ref: '$root.a' } },
    { b: { ref: { val: true } } }
  )

  const r = s(
    'initial subscription',
    [{ path: 'b/ref', type: 'new' }]
  )

  s(
    'referenced field origin',
    [{ path: 'b/ref', type: 'update' }],
    { b: { $: 2, ref: { $: 2, $ref: r.state.a } } },
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
  const result = s(
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
    {
      b: {
        $: 2,
        $ref: result.state.c,
        b: {
          $ref: result.state.c.b,
          $: 1,
          c: {
            $: 1,
            $ref: result.state.c.b.c
          }
        }
      }
    },
    { b: '$root.c' }
  )
  s(
    'remove reference',
    [
      { path: 'c/b/c', type: 'remove-ref' },
      { path: 'c/b/c', type: 'remove-ref', sType: 'done' }
    ],
    { b: { $: 3 } },
    { b: false }
  )
  t.end()
})
