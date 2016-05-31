'use strict'
const test = require('tape')
const subsTest = require('../util')

test('switch - branches', (t) => {
  const subs = {
    exec  (state, type, stamp, subs, tree, sType) {
      if (state.key === 'a') {
        return 'optionA'
      } else if (state.key === 'b') {
        return 'optionB'
      }
    },
    optionA: { a: { val: true } },
    optionB: { b: { val: true } }
  }
  const subscription = {
    field: {
      $switch1: subs,
      $switch2: subs
    }
  }
  const s = subsTest(
    t,
    {
      a: { a: 'its a/a' },
      b: { b: 'its b/b' },
      field: '$root.a'
    },
    subscription
  )
  s(
    'initial subscription',
    [
      { path: 'a/a', type: 'new' },
      { path: 'a/a', type: 'new' }
    ]
  )
  t.end()
})
