'use strict'
const test = require('tape')
const subsTest = require('../util')
const field = require('../util/field')

module.exports = function (type) {
  test(type + ' - references', function (t) {
    var r
    const s = subsTest(
      t,
      {
        bla: {},
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
      s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
      s('fire d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'no!' } } })
    } else if (type === 'parent') {
      r = s('initial subscription', [])
      // have to relay tree on ref change...
      // also gave to relay tree on root change...
      // this is for everyhting -- need to update $c!!!
      console.log('!@#!@#!@#whats happneing here! ?', r.tree)
      s('fire d', [ { path: 'd', type: 'new' } ], { d: 'hello!' })
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
