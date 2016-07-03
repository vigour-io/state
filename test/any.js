'use strict'
const test = require('tape')
const subsTest = require('./util')

test('any', function (t) {
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
      fields: [
        { title: 'james' },
        { title: 'yuz' }
      ]
    }
  )

  s(
    'specific field in a collection',
    [ { path: 'fields/0/title', type: 'update' } ],
    { fields: [ { title: 'smurts' } ] }
  )

  s(
    'remove field in a collection',
    [
      { path: 'fields/0/title', type: 'remove' }
    ],
    { fields: [ null ] }
  )

  s(
    'toplevel id collection subscription',
    [ { path: 'a/id', type: 'new' } ],
    { a: { id: true } }
  )

  t.end()
})

test('any - true', function (t) {
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
    {
      a: {},
      b: {}
    }
  )

  s(
    'change field',
    [ { path: 'a', type: 'update' } ],
    { a: 'a' }
  )

  s(
    'remove field',
    [
      { path: 'a', type: 'remove' }
    ],
    { a: null }
  )
  t.end()
})

test('any - val: "property"', function (t) {
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
    {
      a: {},
      b: {}
    }
  )

  s(
    'set fields',
    [],
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
    { a: null }
  )

  t.end()
})

test('any - combined with a field with nested subs', function (t) {
  var s = subsTest(
    t,
    {},
    {
      field: { nested: { val: true } },
      $any: { val: true }
    }
  )

  s('initial subscription', [], {})

  s(
    'create fields',
    [
      { path: 'field/nested', type: 'new' },
      { path: 'a', type: 'new' },
      { path: 'field', type: 'new' }
    ],
    {
      a: {},
      field: {
        nested: 'hello'
      }
    }
  )

  t.end()
})

test('any - empty fields', function (t) {
  var s = subsTest(
    t,
    {
      fields: [ true, true ]
    },
    {
      fields: {
        $remove: true,
        $any: { val: true, $remove: true }
      }
    }
  )

  s('initial subscription', [
    { path: 'fields/0', type: 'new' },
    { path: 'fields/1', type: 'new' }
  ])

  s(
    'remove fields',
    [ { type: 'remove' }, { type: 'remove' } ],
    {
      fields: { reset: true }
    }
  )

  t.end()
})

test('any - remove nested fields using $remove listener', function (t) {
  var s = subsTest(
    t,
    {
      fields: [ true, true ]
    },
    {
      fields: {
        $remove: true,
        $any: { val: true, $remove: true }
      }
    }
  )

  s('initial subscription', [
    { path: 'fields/0', type: 'new' },
    { path: 'fields/1', type: 'new' }
  ])

  s(
    'remove fields',
    [
      { path: 'fields/0', type: 'remove' }, { path: 'fields/1', type: 'remove' }
    ],
    {
      fields: null
    }
  )

  t.end()
})
