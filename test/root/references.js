const test = require('tape')
const subsTest = require('../test')
test('root - references', function (t) {
  const subscription = {
    a: {
      b: { $root: { b: { d: true } } }
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
  s('initial subscription', [{ path: 'c/d', type: 'new', sType: 'root' }])
  s(
    'switch reference on b',
    [{ path: 'd/d', type: 'update', sType: 'root' }],
    false,
    { b: '$root.d' }
  )
  s(
    'remove reference on b',
    [{ path: 'd/d', type: 'remove-ref', sType: 'root' }],
    false,
    { b: 'no more ref!' }
  )
  t.end()
})
