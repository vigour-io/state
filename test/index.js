'use strict'
var test = require('tape')
var s = require('../s')
var subscribe = require('../subscribe')

// module.exports = function (target, subscription, handler, tree) {
test('simple subscription', function (t) {
  var state = s({ field: true })
  // support functions in subscriptiosn
  var tree = subscribe(state, { field: true }, function () {
    console.log('hey!', arguments)
  })

  console.log(tree)

  // state.field.val = 'yuzi'
})
