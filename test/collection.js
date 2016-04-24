'use strict'
const test = require('tape')
const subsTest = require('./test')

test('collection', function (t) {
  // use this for .val and normal fields then add collection as a separate
  const s = subsTest(
    t,
    {},
    {
      fields: { $any: { title: true } },
      $any: { id: true }
    }
  )

  s('initial subscription', [], {})

  s(
    'create a collection',
    [
      { path: 'fields/0/title', type: 'new' },
      { path: 'fields/1/title', type: 'new' }
    ],
    {
      fields: {
        0: { $: 2, title: 2 },
        1: { $: 2, title: 2 },
        $: 2
      }
    },
    {
      fields: [
        { title: 'james' },
        { title: 'yuz' }
      ]
    }
  )

  s(
    'specific field in a collection',
    [ { path: 'fields/0/title', type: 'update' } ],
    {
      fields: {
        0: { $: 3, title: 3 },
        1: { $: 2, title: 2 },
        $: 3
      }
    },
    { fields: [ { title: 'smurts' } ] }
  )

  s(
    'remove field in a collection',
    // zit er nog bij -- "fields/0", "fields/0/title" why suddenly 2??
    [
      { path: 'fields/0/title', type: 'remove' }
    ],
    {
      fields: {
        1: { $: 2, title: 2 },
        $: 4
      }
    },
    { fields: [ null ] }
  )

  s(
    'toplevel id collection subscription',
    [ { path: 'a/id', type: 'new' } ],
    {
      fields: {
        1: { $: 2, title: 2 },
        $: 4
      },
      a: { $: 5, id: 5 }
    },
    { a: { id: true } }
  )

  t.end()
})

test('collection using true', function (t) {
  // use this for .val and normal fields then add collection as a separate
  var s = subsTest(
    t,
    {},
    // make true work
    // { $any: true }
    { $any: { val: true } }
  )

  s('initial subscription', [], {})

  s(
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

  s(
    'remove field',
    [
      { path: 'a', type: 'remove' }
    ],
    false,
    { a: null }
  )

  t.end()
})
