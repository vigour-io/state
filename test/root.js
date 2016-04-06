'use strict'
var test = require('tape')
var subsTest = require('./test')
var subscribe = require('../subscribe')
var s = require('../s')

test('root subscription', function (t) {
  var state = s({
    something: {
      a: true
      // b: true
    }, // enable c get more depth
    james: true
  })

  var subs = {
    something: {
      james: { hello: true },
      a: {
        $root: { james: { hello: true } }
      },
      b: {
        $root: { james: true },
        c: { $root: { james: { hello: true } } }
      }
    }
  }

  var cnt = 0
  var tree = subscribe(state, subs, function (type) {
    cnt++
    console.log('FIRED:', type, cnt, this.path())
  })
  console.log('TREE', JSON.stringify(tree, false, 2))
  t.end()
})
