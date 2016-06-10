'use strict'
const test = require('tape')
const subsTest = require('../util')
const field = require('../util/field')

module.exports = function (type) {
  test(type, function (t) {
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
      field({
        top: {
          b: {
            c: {
              d: {
                $remove: true,
                $parent: {
                  $remove: true,
                  val: true,
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
      }, type, '$parent')
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
      // this is a bit weird as behvaeiour but ok...
      [ { path: 'top/b/c/d', type: 'remove' } ],
      { top: { b: { c: { d: null } } }
    })
    t.end()
  })

  test(type + ' - type', function (t) {
    // prop somehting with sid
    const s = subsTest(
      t,
      {
        types: {
          swag: {
            val: ''
          }
        },
        a: {
          b: {
            d: 'yes!',
            c: {
              type: 'swag'
            }
          }
        }
      },
      field({
        a: {
          b: {
            c: {
              $parent: {
                d: { val: true }
              }
            }
          }
        }
      }, type, '$parent')
    )
    s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
    t.end()
  })

  test(type + ' - $any', function (t) {
    const s = subsTest(
      t,
      {
        collection: {
          a: true,
          b: true
        }
      },
      field({
        collection: {
          $any: {
            $parent: {
              $parent: {
                focus: { val: true }
              }
            }
          }
        }
      }, type, '$parent')
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
}
