'use strict'
var test = require('tape')
var subsTest = require('./test')

test('basic subscription', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var subs = subsTest(
    t,
    { field: true, something: false },
    {
      field: true,
      other: {
        yuzi: true,
        fields: { $any: { title: true } }
      }
    }
  )

  subs(
    'initial subscription',
    [{ path: 'field', type: 'new' }],
    { field: 1 }
  )

  subs(
    'create a collection',
    [
      { path: 'other/fields/0/title', type: 'new' },
      { path: 'other/fields/1/title', type: 'new' }
    ],
    {
      field: 1,
      other: {
        $: 2,
        fields: {
          0: { $: 2, title: 2 },
          1: { $: 2, title: 2 },
          $: 2
        }
      }
    },
    {
      other: {
        fields: [
          { title: 'james' },
          { title: 'yuz' }
        ]
      }
    }
  )

  subs(
    'specific field in a collection',
    [ { path: 'other/fields/0/title', type: 'update' } ],
    {
      field: 1,
      other: {
        $: 3,
        fields: {
          0: { $: 3, title: 3 },
          1: { $: 2, title: 2 },
          $: 3
        }
      }
    },
    { other: { fields: [ { title: 'smurts' } ] } }
  )

  subs(
    'remove field in a collection',
    [ { path: 'other/fields/0', type: 'remove' } ],
    {
      field: 1,
      other: {
        $: 4,
        fields: {
          1: { $: 2, title: 2 },
          $: 4
        }
      }
    },
    { other: { fields: [ null ] } }
  )

  t.end()
})
