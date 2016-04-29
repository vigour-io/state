'use strict'
const test = require('tape')
const subsTest = require('./test')

test('basic', function (t) {
  const s = subsTest(
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

  s(
    'remove other',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { field: 1 },
    { other: null }
  )

  t.end()
})

test('basic - $done', function (t) {
  const s = subsTest(
    t,
    { a: { b: 'its b!' } },
    {
      a: {
        val: true,
        $done: true,
        b: true
      }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'a', type: 'new' },
      { path: 'a/b', type: 'new' },
      { path: 'a', type: 'new' }
    ]
  )
  t.end()
})
