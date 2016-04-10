'use strict'
var test = require('tape')
var subsTest = require('./test')

test('parent', function (t) {
  var s = subsTest(
    t,
    { a: { b: { c: {} } } },
    {
      a: {
        b: {
          c: {
            parent: {
              parent: {
                d: true
              }
            }
          }
        }
      }
    }
  )
  var result = s('initial subscription', [], false)

  s('create c field', [
      { path: 'a/b/c', type: 'update' }
    ],
    false,
    { a: { d: true } }
  )

  console.log('TREE:', JSON.stringify(result.tree, false, 2))
  t.end()
})
