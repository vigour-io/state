'use strict'
const test = require('tape')
const subsTest = require('../test')

test('root - collection', function (t) {
  const subscription = {
    a: {
      $any: {
        $root: {
          b: { val: true }
        }
      }
    }
  }
  const a = [ 1, 2, 3, 4 ]
  const s = subsTest(t, { a: a, b: 'hello b!' }, subscription)

  s('initial subscription', multiple('update'))
  s('set b', multiple('update'), false, { b: 'hello b2!' })
  t.end()
  function multiple (type) {
    const val = []
    for (let i = 0, len = a.length; i < len; i++) {
      val.push({ type: type, path: 'b' })
    }
    return val
  }
})