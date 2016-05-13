'use strict'
const test = require('tape')
const subsTest = require('./test')

test('collection', function (t) {
  const s = subsTest(
    t,
    {},
    {
      fields: { $remove: true, $any: { title: { val: true }, $remove: true } },
      $any: { id: { val: true } }
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
        0: { $: 2, title: { $: 2 } },
        1: { $: 2, title: { $: 2 } },
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
        0: { $: 3, title: { $: 3 } },
        1: { $: 2, title: { $: 2 } },
        $: 3
      }
    },
    { fields: [ { title: 'smurts' } ] }
  )

  s(
    'remove field in a collection',
    [
      { path: 'fields/0/title', type: 'remove' }
    ],
    {
      fields: {
        1: { $: 2, title: { $: 2 } },
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
        1: { $: 2, title: { $: 2 } },
        $: 4
      },
      a: { $: 5, id: { $: 5 } }
    },
    { a: { id: true } }
  )

  s(
    'remove toplevel collection',
    [ { path: 'fields', type: 'remove' } ],
    { a: { $: 5, id: { $: 5 } } },
    { fields: null }
  )

  t.end()
})

test('collection - true', function (t) {
  var s = subsTest(
    t,
    {},
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
      a: {},
      b: {}
    }
  )

  s(
    'change field',
    [ { path: 'a', type: 'update' } ],
    false,
    { a: 'a' }
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

test('collection - val:"property"', function (t) {
  var s = subsTest(
    t,
    {},
    { $any: { val: 'property' } }
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
      a: {},
      b: {}
    }
  )

  s(
    'set fields',
    [],
    false,
    {
      a: 'a',
      b: 'b'
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
