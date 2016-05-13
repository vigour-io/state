'use strict'
const test = require('tape')
const subsTest = require('../test')
const logger = require('../log')

test('root - basic', function (t) {
  const state = require('../../s')
  const subscription = {
    a: {
      b: {
        $root: {
          b: { val: true }
        },
        c: {
          $root: {
            c: { val: true }
          }
        }
      }
    }
  }
  const s = subsTest(t, state({ a: { b: { c: {} } } }, false), subscription)
  const r = s('create b', [ { path: 'b', type: 'new' } ], false, { b: 'hello b!' })

  s('update c', [ { path: 'c', type: 'new' } ], false, { c: 'hello c2!' })

  // s('remove b', [ { path: 'b', type: 'remove' } ], false, { b: null })

  logger(r.tree)

  t.end()
})