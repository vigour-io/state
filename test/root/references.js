const test = require('tape')
const subsTest = require('../test')
test('root - references', function (t) {
  const subscription = {
    a: {
      b: { $root: { b: { d: true } } }
    }
  }

  const state = {
    a: '$root.e', // this has to work ofcourse -- what goes wrong is the target
    b: '$root.c',
    c: { d: 'c.d' },
    d: { d: 'd.d' },
    e: { b: {} }
  }

  const s = subsTest(t, state, subscription)
  const result = s('initial subscription', [{ path: 'c/d', type: 'new', sType: 'root' }])

  console.log('SWITCH')
  s(
    'switch reference on b',
    [{ path: 'd/d', type: 'update', sType: 'root' }],
    false,
    { b: '$root.d' }
  )

  console.log(result.tree)

  console.log('REMOVE')
  s(
    'remove reference on b',
    [{ path: 'd/d', type: 'remove-ref', sType: 'root' }],
    false,
    { b: 'no more ref!' }
  )
  t.end()
})
