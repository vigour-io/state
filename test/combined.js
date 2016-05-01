'use strict'
const test = require('tape')
const subsTest = require('./test')

test.skip('combined', function (t) {
  // also add root on root
  const subscription = {
    a: {
      $any: {
        $root: {
          b: { val: true }
        }
      }
    }
  }
  const c = [ 1, 2, 3, 4 ]
  const state = {
    c: c,
    a: '$root.c',
    b: '$root.d',
    d: 'hello'
  }
  const s = subsTest(t, state, subscription)
  s('initial subscription', multiple('update'))
  s('set b', multiple('update'), false, { b: 'hello b2!' })
  t.end()
  function multiple (type) {
    const val = []
    for (let i = 0, len = c.length; i < len; i++) {
      val.push({ type: type, path: 'b' })
    }
    return val
  }
})
