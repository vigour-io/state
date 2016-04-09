'use strict'
var test = require('tape')
var subsTest = require('./test')

test('collection', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var subs = subsTest(
    t,
    {},
    {
      fields: { $any: { title: true } }
    }
  )

  subs('initial subscription', [], {})

  subs(
    'create a collection',
    [
      { path: 'fields/0/title', type: 'new' },
      { path: 'fields/1/title', type: 'new' }
    ],
    {
      fields: {
        0: { $: 1, title: 1 },
        1: { $: 1, title: 1 },
        $: 1
      }
    },
    {
      fields: [
        { title: 'james' },
        { title: 'yuz' }
      ]
    }
  )

  subs(
    'specific field in a collection',
    [ { path: 'fields/0/title', type: 'update' } ],
    {
      fields: {
        0: { $: 2, title: 2 },
        1: { $: 1, title: 1 },
        $: 2
      }
    },
    { fields: [ { title: 'smurts' } ] }
  )

  subs(
    'remove field in a collection',
    [ { path: 'fields/0', type: 'remove' } ],
    {
      fields: {
        1: { $: 1, title: 1 },
        $: 3
      }
    },
    { fields: [ null ] }
  )

  t.end()
})
