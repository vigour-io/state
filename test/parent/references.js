'use strict'
const test = require('tape')
const subsTest = require('../util')
const field = require('../util/field')

module.exports = function (type) {
  test(type + ' - references', function (t) {
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

    if (type === '$parent') {
      s('initial subscription', [], {})
      s('fire d', [ { path: 'a/b/d', type: 'new' } ], { a: { b: { d: 'no!' } } })
      s('fire d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'yes!' } } })
    } else if (type === 'parent') {
      s('initial subscription', [ { path: 'bla/d', type: 'new' } ])
      // s('fire d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'no!' } } })
    }
    t.end()
  })

// test('parent - references - double', function (t) {
//   const s = subsTest(
//     t,
//     {
//       bla: {
//         d: 'xxxx'
//       },
//       a: {
//         b: {
//           c: {
//             deep: '$root.bla'
//           },
//           d: 'yes!'
//         }
//       }
//     },
//     {
//       a: {
//         b: {
//           c: {
//             deep: {
//               $parent: {
//                 $parent: {
//                   d: { val: true }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   )
//   s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
//   // maybe add some switch ref tests
//   // this is were the 2 types start to divert
//   t.end()
// })
}
