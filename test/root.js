'use strict'
var test = require('tape')
var subsTest = require('./test')

test('root subscription', function (t) {
  var subs = subsTest(
    t,
    { field: true, something: false },
    {
      field: true,
      other: {
        field: true,
        something: {
          a: true,
          b: { '~': { james: true } }
        }
      }
    }
  )

  // subs()

  t.end()
})
