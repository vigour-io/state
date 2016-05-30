'use strict'
const test = require('tape')
const subsTest = require('../util')

test('parent - references', function (t) {
  const s = subsTest(
    t,
    {
      bla: {
        d: 'xxxx'
      },
      a: {
        b: {
          c: '$root.bla',
          d: 'yes!'
        }
      }
    },
    {
      a: {
        b: {
          c: {
            $parent: {
              d: { val: true }
            }
          }
        }
      }
    }
  )
  s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
  t.end()
})
