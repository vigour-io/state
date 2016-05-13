'use strict'
const test = require('tape')
const subsTest = require('./test')
const logger = require('./log')

test('parent', function (t) {
  const s = subsTest(
    t,
    {
      top: {
        a: 'its d!',
        b: {
          c: 'hello!'
        }
      }
    },
    {
      top: {
        b: {
          $parent: {
            a: { val: true }
          }
        }
      }
    },
    true
  )

  const r = s('initial subscription', [ { path: 'top/a', type: 'new' } ])
  logger(r.tree)
  t.end()

})
