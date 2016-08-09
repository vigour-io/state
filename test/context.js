'use strict'
const test = require('tape')
const State = require('..')

test('context', function (t) {
  const state = new State({
    key: 'this is state normal',
    a: true,
    b: true
  })
  const instance = new state.Constructor({
    key: 'instance'
  })
  var cnt = 0
  instance.subscribe({
    val: true
  }, (state) => {
    cnt++
  })
  instance.set({ b: false })
  state.set({ b: 'hello' })
  t.equal(cnt, 4, 'fired 4 times')
  t.end()
})
