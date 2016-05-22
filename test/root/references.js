const test = require('tape')
const subsTest = require('../util')
test('root - references', function (t) {
  const subscription = {
    a: {
      b: {
        $root: {
          b: {
            d: { val: true }
          }
        }
      }
    }
  }

  const state = {
    a: '$root.e',
    b: '$root.c',
    c: { d: 'c.d' },
    d: { d: 'd.d' },
    e: { b: {} }
  }

  const s = subsTest(t, state, subscription)
  s('initial subscription', [{ path: 'c/d', type: 'new' }])
  s(
    'switch reference on b',
    [{ path: 'd/d', type: 'update' }],
    { b: '$root.d' }
  )

  s(
    'remove reference on b',
    [{ type: 'remove' }],
    { b: 'no more ref!' }
  )
  t.end()
})
