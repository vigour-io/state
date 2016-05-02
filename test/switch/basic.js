'use strict'
const test = require('tape')
// const subsTest = require('../test')

test('root - basic', function (t) {
  const s = require('../../s')
  const state = s({
    bla: {
      a: 'hahaha it b!'
    },
    field: {
      a: 'hello!',
      b: 'bye!'
    }
  })
  state.subscribe({
    field: {
      $switch: {
        // type is same as prev type -- update / new / remove / OR remove-switch (somewthing like this???)
        // different name then fn...
        switch  (state, type, stamp, subs, tree, sType) {
          console.log('lets switch!', state)
          if (state.key === 'bla') {
            return 'doA'
          }
        },
        // supports val 1 ofc
        val: true,
        doA: { a: true }, // fields do not represent fields in the tree (just subs - uids)
        doB: { b: true }
      }
    }
  }, function (state, type, stamp, subs, tree, sType) {
    console.log('UPDATE!!!', state, type, sType)
  })

  state.field.set(state.bla)

  t.end()
})
