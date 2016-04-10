'use strict'
var test = require('tape')
var subsTest = require('./test')

test('reference', function (t) {
  // need to reset event stamp :/
  // use this for .val and normal fields then add collection as a separate
  var s = subsTest(
    t,
    { a: 'a', b: { ref: '$root.a' } },
    { b: { ref: true } }
  )

  // need to reset stamps this sucks!
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
