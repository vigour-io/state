'use strict'
var test = require('tape')
// var subsTest = require('./test')
var subscribe = require('../subscribe')
var s = require('../s')

test('root subscription', function (t) {
  var state = s({
    something: {
      a: true,
      // b: true
    }, // enable c get more depth
    james: true
  })

  var subs = {
    something: {
      a: {
        '~': { james: { hello: true } }
      },
      b: {
        '~': { james: true }
        // c: { '~': { james: { hello: true } } }
      }
    }
  }

  var tree = subscribe(state, subs, function (type) {
    console.log('#listener fires:', type, this.path.join('/'))
  })

  // should not fire

  // console.log(JSON.stringify(tree, false, 2))

  console.log('#set b')

  // difference is setting it later fix it
  state.something.set({ b: true })
  // state.something.set({ b: { c: true } })  // does not work yet
  // c should not fire
  // console.log(JSON.stringify(tree, false, 2))
  console.log('#set james should not fire a, should fire b')
  state.james.val = 'hello!'
  // should not fire

  // console.log(JSON.stringify(tree, false, 2))

  // console.log('#set james/hello now should fire')
  // should fire
  // state.james.set({ hello: 'hello!' })

  console.log(JSON.stringify(tree, false, 2))
  // console.log('#update on nested james field')

  t.end()
})
