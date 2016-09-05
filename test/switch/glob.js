'use strict'
const test = require('tape')
const subsTest = require('../util')

test('switch - glob', (t) => {
  const subscription = {
    field: {
      $switch: {
        $remove: true,
        '*.b': { val: true },
        'a.*.b': { val: true }
      }
    }
  }

  const s = subsTest(
    t,
    {
      field: '$root.a.x.b',
      a: {
        x: {
          b: 'im a/x/b'
        }
      },
      b: {
        b: 'im b/b'
      },
      z: {
        b: 'im z/b',
        z: 'im z/z'
      }
    },
    subscription
  )

  s('initial subscription', [
    { type: 'new', path: 'a/x/b', tree: 'field/$switch/$current' }
  ])

  s(
    'set field to b/b',
    [
      { path: 'a/x/b', type: 'remove', tree: 'field/$switch/$current' },
      { path: 'b/b', type: 'new' }
    ],
    { field: '$root.b.b' }
  )

  s(
    'set field to z/b',
    [
      { path: 'b/b', type: 'remove', tree: 'field/$switch/$current' },
      { path: 'z/b', type: 'new' }
    ],
    { field: '$root.z.b' }
  )

  s(
    'set field to z/z',
    [
      { path: 'z/b', type: 'remove', tree: 'field/$switch/$current' }
    ],
    { field: '$root.z.z' }
  )

  t.end()
})
