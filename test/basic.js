'use strict'
var test = require('tape')
var subsTest = require('./test')

test('basic', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var subs = subsTest(
    t,
    { field: true, something: false },
    {
      field: true,
      other: {
        yuzi: true
      }
    }
  )

  subs(
    'initial subscription',
    [{ path: 'field', type: 'new' }],
    { field: 1 }
  )

  subs(
    'update nested field',
    [ { path: 'other/yuzi', type: 'new' } ],
    {
      field: 1,
      other: {
        $: 2,
        yuzi: 2
      }
    },
    { other: { yuzi: true } }
  )

  subs(
    'remove field',
    [ { path: 'other/yuzi', type: 'remove' } ],
    {
      field: 1,
      other: {
        $: 3
      }
    },
    { other: { yuzi: null } }
  )

  subs(
    'reset yuzi',
    [ { path: 'other/yuzi', type: 'new' } ],
    {
      field: 1,
      other: {
        $: 4,
        yuzi: 4
      }
    },
    { other: { yuzi: true } }
  )

  subs(
    'remove other',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { field: 1 },
    { other: null }
  )

  t.end()
})
