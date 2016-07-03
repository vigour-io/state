'use strict'
const test = require('tape')
const subsTest = require('../util')
const field = require('../util/field')

module.exports = function (type) {
  test(type + ' - root', function (t) {
    const s = subsTest(
      t,
      {
        bla: {},
        a: {},
        b: {
          d: 'yes',
          c: {}
        }
      },
      field({
        a: {
          $root: {
            b: {
              c: {
                $parent: {
                  d: { val: true }
                }
              }
            }
          }
        }
      }, type, '$parent')
    )
    s('initial subscription', [ { path: 'b/d', type: 'new' } ])
    s('update b/d', [ { path: 'b/d', type: 'update' } ], { b: { d: 'x' } })
    t.end()
  })
}
