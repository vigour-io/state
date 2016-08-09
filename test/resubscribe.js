'use strict'
const test = require('tape')
const State = require('..')

test('resubscribe', function (t) {
  const state = new State({
    key: 'this is state normal',
    a: true,
    b: true
  })
  var original = 0
  state.subscribe({
    a: { val: true }
  }, (state) => {
    original++
  }, void 0, void 0, 'attach')

  state.subscribe({
    a: { val: true }
  }, (state) => {
    original++
  })
  const instance = new state.Constructor({
    key: 'instance'
  })
  var cnt = 0
  instance.subscribe({
    a: { val: true }
  }, (state) => {
    cnt++
  })
  cnt = 0
  original = 0
  instance.resubscribe()
  t.equal(cnt, 1, 'refire subscription')
  t.equal(original, 0, 'dont refire original subscription')
  t.end()
})
