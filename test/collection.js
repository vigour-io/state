'use strict'
var test = require('tape')
var subsTest = require('./test')

test('collection', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var subs = subsTest(
    t,
    {},
    {
      fields: { $any: { title: true } },
      $any: { id: true }
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
    // zit er nog bij -- "fields/0", "fields/0/title" why suddenly 2??
    [
      { path: 'fields/0/title', type: 'remove' }
    ],
    {
      fields: {
        1: { $: 1, title: 1 },
        $: 3
      }
    },
    { fields: [ null ] }
  )

  subs(
    'toplevel id collection subscription',
    [ { path: 'a/id', type: 'new' } ],
    {
      fields: {
        1: { $: 1, title: 1 },
        $: 3
      },
      a: { $: 4, id: 4 }
    },
    { a: { id: true } }
  )

  t.end()
})

test('collection using true', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var subs = subsTest(
    t,
    {},
    // make true work
    // { $any: true }
    { $any: { val: true } }
  )

  var s = subs('initial subscription', [], {})

  subs(
    'create fields',
    [
      { path: 'a', type: 'new' },
      { path: 'b', type: 'new' }
    ],
    false,
    {
      a: {}, // emit does not fire for empty objects why?? we want that!
      b: {}
    }
  )

  subs(
    'remove field',
    [
      { path: 'a', type: 'remove' }
    ],
    false,
    { a: null }
  )

  t.end()
})
