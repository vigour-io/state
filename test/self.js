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
        focus: 'b title'
      }
    },
    {
      items: {
        $self: {
          $any: {
            // any allways has to use self in this case except when doing val: true or somehting
            // need a special case for this
            // check it in any itself
            $origin: {
              focus: { val: true }
            },
            title: { val: true }
          }
        }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'b/focus', type: 'new' },
      { path: 'items/a/title', type: 'new' }
    ]
  )

  t.end()
})

test('self and non self', function (t) {
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
      field: {
        field: {
          val: true
        }
      },
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
    [{ path: 'a/field', type: 'new' },
    { path: 'field/field', type: 'new' }]
  )

  t.end()
})
