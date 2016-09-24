'use strict'
const test = require('tape')
const subsTest = require('./util')

test('self', function (t) {
  const s = subsTest(
    t,
    {
      a: {
        field: 'not so lullz'
      },
      field: {
        val: '$root.a',
        field: 'lullz'
      }
    },
    {
      $self: {
        field: {
          field: {
            val: true
          }
        }
      }
    }
  )

  s(
    'initial subscription',
    [{ path: 'field', type: 'new' }]
  )

  // s(
  //   'update nested field',
  //   [ { path: 'other/yuzi', type: 'new' } ],
  //   { other: { yuzi: true } }
  // )

  t.end()
})
