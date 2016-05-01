'use strict'
const test = require('tape')
const subsTest = require('./test')

test('combined', function (t) {
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
  const c = [ 1, 2 ]

  const state = {
    c: c,
    a: '$root.c',
    b: '$root.d',
    d: 'hello'
  }

  const s = subsTest(t, state, subscription)
  const initial = multiple('update', 'b')
  initial[0].type = 'new'

  //
  s('initial subscription', initial)
  // s('set b', multiple('update'), false, { b: 'hello b2!' })
  // s('update d', multiple('update', 'b'))

  t.end()
  function multiple (type, path) {
    const val = []
    for (let i = 0, len = c.length; i < len; i++) {
      val.push({ type: type, path: path })
    }
    return val
  }
})
