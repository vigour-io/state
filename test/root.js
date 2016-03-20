'use strict'
var test = require('tape')
// var subsTest = require('./test')
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
      a: {
        '~': { james: true }
      },
      b: {
        '~': { james: true },
        c: { '~': { james: { hello: true } } }
      }
    }
  }

  var tree = subscribe(state, subs, function (type) {
    console.log('#update:', type, this.path.join('/'))
  })

  console.log(JSON.stringify(tree, false, 2))

  console.log('#set b')
  state.something.set({ b: true })
  // state.something.set({ b: { c: true } })  // does not work yet
  console.log(JSON.stringify(tree, false, 2))

  console.log('#update james')
  state.james.val = 'hello!'
  console.log(JSON.stringify(tree, false, 2))

  t.end()
})
