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
      // idea is if you pass an observable here it will just use the subs map from that observable
      field: true,
      other: {
        val: true,
        yuzi: true,
        fields: {
          '*': { title: true }
        }
      }
    },
    function (type, event) {
      console.log('update:', this, 'type:', type)
    }
  )

  state.set({
    other: {
      fields: [{ title: 'james' }, { title: 'yuz' }]
    }
  })

  console.log(JSON.stringify(tree, false, 2))

  t.end()
})
