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
  // dont refire for change in ref! --store sid and dont do stuff
  s('fire d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'no!' } } })
  t.end()
})

test('parent - references - double', function (t) {
  const s = subsTest(
    t,
    {
      bla: {
        d: 'xxxx'
      },
      a: {
        b: {
          c: {
            deep: '$root.bla'
          },
          d: 'yes!'
        }
      }
    },
    {
      a: {
        b: {
          c: {
            deep: {
              $parent: {
                $parent: {
                  d: { val: true }
                }
              }
            }
          }
        }
      }
    }
  )
  s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
  t.end()
})
