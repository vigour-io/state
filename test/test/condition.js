'use strict'
const test = require('tape')
const subsTest = require('../util')

test('test - condition', function (t) {
  const subs = {
    letters: {
      $any: {
        $test: {
          exec (state) {
            return state.turd && state.turd.compute() === true || state.title.compute() === 'smurf'
          },
          $: {
            title: { val: true },
            turd: { val: true }
          },
          $pass: { smurf: { val: true } }
        }
      }
    }
  }

  const state = {
    letters: [
      { smurf: 'a', title: 'a' },
      { smurf: 'b', title: 'smurf' }
    ]
  }

  const s = subsTest(t, state, subs)

  s('initial subscription', [
    { path: 'letters/1/title', type: 'new' },
    { path: 'letters/1/smurf', type: 'new' }
  ])

  s('set turd on letters[0]', [
    { path: 'letters/0/turd', type: 'new' },
    { path: 'letters/0/smurf', type: 'new' }
  ], { letters: { 0: { turd: true } } })

  s('set smurf to turd on letters[1] (remove)', [
    { path: 'letters/1/title', type: 'update' }
  ], { letters: { 1: { title: 'turd' } } })

  t.end()
})
