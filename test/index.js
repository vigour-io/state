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
  // support functions in subs
  // idea is if you pass an observable here it will just use the subs map from that observable
  var tree = subscribe(
    state,
    {
      field: true,
      other: {
        // val: true, -- this is so nice gives any nested update -- may need to limit to value?
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

  console.log('#set coll')
  state.set({
    other: {
      fields: [{ title: 'james' }, { title: 'yuz' }]
    }
  })

  console.log('#set field')
  state.other.fields[0].title.set('smurts')

  console.log('#remove field')
  state.other.fields[0].remove()

  console.log('#tree')
  console.log(JSON.stringify(tree, false, 2))

  t.end()
})
