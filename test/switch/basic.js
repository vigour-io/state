'use strict'
const test = require('tape')
const subsTest = require('../test')

test('switch - basic', (t) => {
  const subscription = {
    field: {
      $remove: true,
      $switch: {
        map  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'a') {
            return 'optionA'
          } else if (state.key === 'b') {
            return 'optionB'
          }
        },
        $remove: true,
        val: true,
        optionA: { a: { val: true, $remove: true }, $remove: true },
        optionB: { b: { val: true, $remove: true }, $remove: true }
      }
    }
  }
  const s = subsTest(
    t,
    {
      a: { a: 'its a/a' },
      b: { b: 'its b/b' }
    },
    subscription
  )
  const result = s('initial subscription', [], {})

  s(
    'set field to a',
    [
      { path: 'a', type: 'new', sType: 'switch' },
      { path: 'a/a', type: 'new' }
    ],
    { field: '$root.a' }
  )

  s(
    'set field to b',
    [
      { type: 'remove' },
      { path: 'b', type: 'update', sType: 'switch' },
      { path: 'b/b', type: 'new' }
    ],
    { field: '$root.b' }
  )

  s(
    'set field to false',
    [
      { type: 'remove' },
      { path: 'field', type: 'update', sType: 'switch' }
    ],
    { field: false }
  )

  s(
    'set field to a',
    [
      { path: 'a', type: 'update', sType: 'switch' },
      { path: 'a/a', type: 'new' }
    ],
    { field: '$root.a' }
  )

  s(
    'remove field ',
    [
      { type: 'remove' },
      { path: 'field', type: 'remove', sType: 'switch' }
    ],
    { field: null }
  )

  t.same(result.tree, {}, 'tree is empty')

  t.end()
})

test('switch - basic - direct', (t) => {
  const subscription = {
    field: {
      $remove: true,
      $switch: {
        map  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'a') {
            return 'optionA'
          } else if (state.key === 'b') {
            return 'optionB'
          }
        },
        val: true,
        optionA: { val: true },
        optionB: { done: true }
      }
    }
  }
  const s = subsTest(
    t,
    {
      a: 'its a/a',
      b: 'its b/b'
    },
    subscription
  )
  s('initial subscription', [], {})

  s(
    'set field to b',
    [
      { path: 'b', type: 'new', sType: 'switch' },
      { path: 'b', type: 'new', sType: 'done' }
    ],
    { field: '$root.b' }
  )

  s(
    'set field to a',
    [
      { path: 'a', type: 'update', sType: 'switch' },
      { path: 'a', type: 'new' }
    ],
    { field: '$root.a' }
  )

  t.end()
})
