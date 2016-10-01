'use strict'
const test = require('tape')
const State = require('../')

test('force - basic', (t) => {
  const state = new State({
    a: {
      b: {
        c: 'hello'
      }
    }
  })

  state.subscribe({
    val: true
  }, (state) => {
    console.log('update', state)
  })

  // make same test case using switch to start
})