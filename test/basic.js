'use strict'
var test = require('tape')
var subsTest = require('./test')

test('basic', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var s = subsTest(
    t,
    { field: true },
    {
      field: true,
      other: { yuzi: true }
    }
  )

  s(
    'initial subscription',
    [{ path: 'field', type: 'new' }],
    { field: 1 }
  )

  s(
    'update nested field',
    [ { path: 'other/yuzi', type: 'new' } ],
    {
      field: 1,
      other: { $: 2, yuzi: 2 }
    },
    { other: { yuzi: true } }
  )

  s(
    'remove field',
    [ { path: 'other/yuzi', type: 'remove' } ],
    {
      field: 1,
      other: { $: 3 }
    },
    { other: { yuzi: null } }
  )

  s(
    'reset yuzi',
    [ { path: 'other/yuzi', type: 'new' } ],
    {
      field: 1,
      other: { $: 4, yuzi: 4 }
    },
    { other: { yuzi: true } }
  )

  // dus for now dit gewoon lekker laten werken -- wel lastig
  // aangzien je dingen wordne geremoved en je toch nog nested moet checken :/

  s(
    'remove other',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { field: 1 },
    { other: null }
  )

  t.end()
})
