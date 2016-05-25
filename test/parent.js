'use strict'
const test = require('tape')
const subsTest = require('./util')

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
              $remove: true,
              $parent: {
                $remove: true,
                done: true,
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

  s('remove top/b/c/d',
    // this is a bit weird as behvaiour but ok...
    [ { path: 'top/b/c/d', type: 'remove' } ],
    { top: { b: { c: { d: null } } }
  })
  t.end()
})

test('parent - $any', function (t) {
  const s = subsTest(
    t,
    {
      collection: {
        a: true,
        b: true
      }
    },
    {
      collection: {
        $any: {
          $parent: {
            $parent: {
              focus: { val: true }
            }
          }
        }
      }
    }
  )
  s('initial subscription', [], {})
  s(
    'create a collection',
    [
      { path: 'focus', type: 'new' },
      { path: 'focus', type: 'new' }
    ],
    { focus: true }
  )
  t.end()
})
