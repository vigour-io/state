'use strict'
const test = require('tape')
const subsTest = require('../util')

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
        $any: { val: true }
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
    [ 'hello its an update in zero' ]
  )
  s(
    'remove 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    [ null ]
  )
  t.end()
})

test('reference - collection - target - struct', function (t) {
  const subscription = {
    a: {
      $remove: true,
      $any: {
        $remove: true,
        title: { val: true }
      }
    }
  }
  const b = [ { title: 1 }, { title: 2 }, { title: 3 }, { title: 4 } ]
  const s = subsTest(t, { b: b, a: '$root.b' }, subscription)
  s('initial subscription', multiple('new'))
  function multiple (type, nopath) {
    const val = []
    for (let i = 0, len = b.length; i < len; i++) {
      if (nopath) {
        val.push({ type: type })
      } else {
        val.push({ type: type, path: 'b/' + i + '/title' })
      }
    }
    return val
  }

  console.log('what ze fuck')
  s(
    'remove reference',
     multiple('remove', true),
     { a: false }
   )
  t.end()
})
