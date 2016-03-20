'use strict'
var test = require('tape')
// var subsTest = require('./test')
var subscribe = require('../subscribe')
var s = require('../s')

test('root subscription', function (t) {
  var state = s({
    something: { b: true },
    james: true
  })

  var subs = {
    something: {
      a: true,
      b: {
        '~': { james: true },
        c: { '~': { james: { hello: true } } }
      }
    }
  }

  var tree = subscribe(state, subs, function (type) {
    console.log('lets go!', type, this.path.join('/'))
  })

  console.log(
    JSON.stringify(
      tree, false, 2
    )
  )

  t.end()
})
