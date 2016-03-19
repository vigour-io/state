'use strict'
var test = require('tape')
var subsTest = require('./test')

test('reference subscription', function (t) {
  // need to reset event stamp :/
  // use this for .val and normal fields then add collection as a separate
  var subs = subsTest(
    t,
    { a: 'a', b: { ref: '$/a' } },
    { b: { ref: true } }
  )

  // need to reset stamps this sucks!
  subs(
    'initial subscription',
    [{ path: 'b/ref', type: 'new' }],
    { b: { $: 1, ref: 1 } }
  )

  subs(
    'referenced field origin',
    [{ path: 'b/ref', type: 'update' }],
    { b: { $: 2, ref: 2 } },
    { a: 'a-update' }
  )

  t.end()
})
