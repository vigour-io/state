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

  t.end()
})
