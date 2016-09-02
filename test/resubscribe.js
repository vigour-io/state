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
  instance.subscribe({
    a: { val: true }
  }, (state) => {
    cnt++
  }, void 0, void 0, 'attach')
  cnt = 0
  original = 0
  instance.resubscribe()
  t.equal(cnt, 2, 'refire subscription')
  t.equal(original, 0, 'dont refire original subscription')
  t.end()
})

test('resubscribe - switch + test', function (t) {
  const state = new State({
    b: {
      bla: 'gur!!!'
    },
    field: {}
  })
  var cnt = 0
  state.subscribe({
    field: {
      $remove: true,
      $switch: {
        exec: (state) => state.key,
        a: { bla: { val: true } },
        b: {
          bla: {
            $test: {
              exec: (state) => state.val.indexOf('gur') !== -1,
              $pass: { val: true }
            }
          }
        }
      }
    }
  }, (state) => {
    cnt++
  })
  state.field.set(state.b)
  state.resubscribe()
  t.equal(cnt, 2, 'fited twice')
  t.end()
})
