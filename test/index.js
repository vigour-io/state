'use strict'
var test = require('tape')
var s = require('../s')
var subscribe = require('../subscribe')

// module.exports = function (target, subscription, handler, tree) {
test('simple subscription', function (t) {
  var state = s({
    field: true,
    something: false
  })
  // support functions in subscriptiosn
  var tree = subscribe(
    state,
    {
      field: true,
      // idea is if you pass an observable here it will just use the subs map from that observable
      other: {
        val: true,
        yuzi: true
      }
    },
    function (type, event) {
      console.log('update:', this, 'type:', type)
    }
  )

  console.log(state, tree)

  state.field.val = 'yuzi'

  console.log(state, tree)

  state.field.remove()

  console.log(state, tree)

  state.set({
    other: 'hello'
  })

  console.log(state, tree)

  state.set({
    other: { x: true, yuzi: 'its yuzi!' }
  })

  console.log(state, tree)

  state.set({
    field: 'funny bussiness'
  })

  console.log(state, tree)

  console.log('\n\n\n---------------------')

  state.set({
    field: 'monkey ballz',
    other: {
      yuzi: 'yuzi extreme!'
    }
  })

  t.end()
})
