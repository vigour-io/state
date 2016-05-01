'use strict'
const test = require('tape')
const subsTest = require('../test')

test('reference - collection - fields', function (t) {
  const s = subsTest(
    t,
    {
      0: 'its zero',
      1: 'its 1',
      collection: {
        0: '$root.0',
        1: '$root.1'
      }
    },
    {
      collection: {
        $any: true
      }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'collection/0', type: 'new' },
      { path: 'collection/1', type: 'new' }
    ]
  )
  s(
    'update 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    false,
    [ 'hello its an update in zero' ]
  )
  s(
    'remove 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    false,
    [ null ]
  )
  t.end()
})

test('reference - collection - target - leaf', function (t) {
  const b = [ 1, 2, 3, 4 ]
  const s = subsTest(t, { b: b, a: '$root.b' }, { a: { $any: true } })
  s('initial subscription', multiple('new'))
  function multiple (type) {
    const val = []
    for (let i = 0, len = b.length; i < len; i++) {
      val.push({ type: type, path: 'b/' + i })
    }
    return val
  }
  s(
    'remove reference',
     multiple('remove-ref'),
     { a: { $: 2 } },
     { a: false }
   )
  t.end()
})

test('reference - collection - target - struct', function (t) {
  const subscription = {
    a: {
      $any: {
        title: { val: true }
      }
    }
  }
  const b = [ { title: 1 }, { title: 2 }, { title: 3 }, { title: 4 } ]
  const s = subsTest(t, { b: b, a: '$root.b' }, subscription)
  s('initial subscription', multiple('new'))
  function multiple (type) {
    const val = []
    for (let i = 0, len = b.length; i < len; i++) {
      val.push({ type: type, path: 'b/' + i + '/title' })
    }
    return val
  }
  s(
    'remove reference',
     multiple('remove-ref'),
     { a: { $: 2 } },
     { a: false }
   )
  t.end()
})
