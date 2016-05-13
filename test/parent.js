'use strict'
const test = require('tape')
const subsTest = require('./test')

test('parent', function (t) {
  const s = subsTest(
    t,
    {
      sibbling: {
        text: true
      },
      top: {
        a: 'its d!',
        b: {
          c: {
            d: {}
          }
        }
      }
    },
    {
      top: {
        b: {
          c: {
            d: {
              $parent: {
                $parent: {
                  $parent: {
                    a: { val: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  )
  const r = s('initial subscription', [ { path: 'top/a', type: 'new' } ])
  t.equal('$c' in r.tree.top, false, 'no $c in top')
  t.equal(
    '$c' in r.tree.top.b && 'c' in r.tree.top.b.$c,
    true,
    'got b in top/a/$c'
  )
  s('update top/a', [
    { path: 'top/a', type: 'update' }
  ], { top: { a: 'its more a!' } })
  t.end()
})
