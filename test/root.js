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
        $root: { james: { hello: true } }
      },
      b: {
        $root: { james: true },
        c: { $root: { james: { hello: true } } }
      }
    }
  }

  var tree = subscribe(state, subs, function (type) {
    // console.log('listener fires:', type, this.path.join('/'))
  })

  // should not fire

  // console.log(JSON.stringify(tree, false, 2))

  // difference is setting it later fix it
  // state.something.set({ b: true })
  state.james.set({ hello: 'hello?' })

  console.log('#set b/c')
  state.something.set({ b: { c: true } })  // does not work yet
  // c should not fire
  // console.log(JSON.stringify(tree, false, 2))
  // console.log(JSON.stringify(tree, false, 2))
  console.log('#set james should not fire a, should fire b, should not fire c')
  state.james.val = 'hello!'
  // should not fire
  // console.log(JSON.stringify(tree, false, 2))

  // console.log(JSON.stringify(tree, false, 2))

  console.log('#set james/hello now should fire')
  // should fire
  state.james.set({ hello: 'hello!' })
  // correct behaviour

  console.log(JSON.stringify(tree, false, 2))

  // speed tests
  console.time('10k updates')
  var h = state.james.hello
  for (var i = 0; i < 1e4; i++) {
    h.set(i)
  }
  // subs obj is only 70ms! fix obs
  // get this faster!
  console.timeEnd('10k updates')

  // diffing is rly good observable is going ultra slow on this!

  // console.log('#update on nested james field')
  t.end()
})
