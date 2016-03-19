'use strict'
var test = require('tape')
var s = require('../s')
var subsTest = require('./test')

test('basic subscription', function (t) {
  var state = s({
    field: true,
    something: false
  })

  var subs = subsTest(t, state, {
    field: true,
    other: {
      yuzi: true,
      fields: { '*': { title: true } }
    }
  })

  subs(
    'initial subscription',
    [{ path: 'field', type: 'new' }],
    { field: 16 }
  )

  subs(
    'create a collection',
    [
      { path: 'other/fields/0/title', type: 'new' },
      { path: 'other/fields/1/title', type: 'new' }
    ],
    {
      field: 16,
      other: {
        $: 17,
        fields: {
          0: { $: 17, title: 17 },
          1: { $: 17, title: 17 },
          $: 17
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
      field: 16,
      other: {
        $: 19,
        fields: {
          0: { $: 19, title: 19 },
          1: { $: 17, title: 17 },
          $: 19
        }
      }
    },
    {
      other: { fields: [ { title: 'smurts' } ] }
    }
  )

  subs(
    'remove field in a collection',
    [ { path: 'other/fields/0', type: 'remove' } ],
    {
      field: 16,
      other: {
        $: 21,
        fields: {
          1: { $: 17, title: 17 },
          $: 21
        }
      }
    },
    {
      other: { fields: [ null ] }
    }
  )

  t.end()
})
