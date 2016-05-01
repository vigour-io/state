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
