'use strict'
const test = require('tape')
const subsTest = require('../test')

test('root - basic', function (t) {
  const state = require('../../s')
  const subscription = {
    a: {
      $root: {
        b: { val: true, _: 'random information' }
      }
    }
  }
  const s = subsTest(t, state({ a: true }, false), subscription)
  s('create b', [ { path: 'b', type: 'new' } ], false, { b: 'hello b!' })
  s('update b', [ { path: 'b', type: 'update' } ], false, { b: 'hello b2!' })
  s('remove b', [ { path: 'b', type: 'remove' } ], false, { b: null })
  t.end()
})
