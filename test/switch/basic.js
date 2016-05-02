'use strict'
const test = require('tape')
// const subsTest = require('../test')

test('root - basic', function (t) {
  const s = require('../../s')
  const state = s({
    bla: {
      a: 'hahaha it b!'
    },
    blargh: {
      b: 'its blargs'
    },
    field: {}
  })
  var tree = state.subscribe({
    field: {
      $switch: {
        switch  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'bla') {
            return 'doA'
          } else if (state.key === 'blargh') {
            return 'doB'
          }
        },
        val: true,
        doA: { a: { val: true } }, // fields do not represent fields in the tree (just subs - uids)
        doB: { b: { val: true } }
      }
    }
  }, function (state, type, stamp, subs, tree, sType) {
    console.log('UPDATE!!!', state.path(), type, sType || 'normal')
  })

  console.log(' ')
  console.log('CREATE SWITCH')
  state.field.set(state.bla)

  console.log(' ')
  console.log('DONT SWITCH')
  state.bla.set('hello!')

  // console.log('TREE:', tree.field.$switch)
  // state.field.set(state.bla)
  console.log(' ')
  console.log('SWITCH')
  state.field.set(state.blargh)

  console.log(' ')
  console.log('REMOVE')
  state.field.remove()
  // console.log('TREE:', tree.field.$switch)

  t.end()
})
