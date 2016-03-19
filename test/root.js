'use strict'
var test = require('tape')
var s = require('../s')
var subsTest = require('./test')

test('root subscription', function (t) {
  var state = s({
    field: true,
    something: false
  })

  var subs = subsTest(t, state, {
    field: true,
    other: {
      yuzi: true,
      something: {
        a: true,
        b: { '~': { james: true } }
      }
    }
  })

  t.end()
}
