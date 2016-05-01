'use strict'
const test = require('tape')
const subsTest = require('../test')

test('reference - collection', function (t) {
  const s = subsTest(
    t,
    {
      0: 'its zero',
      1: 'its 1',
      collection: {
        0: '$root.0',
        1: '$root.1'
      }
    },
    {
      collection: {
        $any: true
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'collection/0', type: 'new' },
      { path: 'collection/1', type: 'new' }
    ]
  )

  s(
    'update 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    false,
    [ 'hello its an update in zero' ]
  )

  s(
    'remove 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    false,
    [ null ]
  )

  t.end()
})
