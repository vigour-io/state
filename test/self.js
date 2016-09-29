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
    [{ path: 'field/field', type: 'new' }]
  )

  t.end()
})

test('self - any', function (t) {
  const s = subsTest(
    t,
    {
      items: {
        a: {
          val: '$root.b',
          title: 'a title'
        }
      },
      b: {
        title: 'b title'
      }
    },
    {
      items: {
        $self: {
          $any: {
            title: {
              val: true
            }
          }
        }
      }
    }
  )

  s(
    'initial subscription',
    [{ path: 'items/a/title', type: 'new' }]
  )

  t.end()
})
