'use strict'
const test = require('tape')
const subsTest = require('./util')

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

  s(
    'remove toplevel collection',
    [],
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

test('collection - val: "property"', function (t) {
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

test('collection - combined with a field with nested subs', function (t) {
  var s = subsTest(
    t,
    {},
    {
      field: { nested: { val: true } },
      $any: { val: true }
    }
  )

  s('initial subscription', [], {})

  // uses same subs -- $ is same and then it goes wrong
  // 2 options -- if colleciton and setting someone else of the other way arround need to
  // exclude field from collection or merge
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
