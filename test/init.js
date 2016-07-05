'use strict'
const test = require('tape')
const vstamp = require('vigour-stamp')
const State = require('../')

test('init', function (t) {
  const state = new State({}, false)
  t.equal(state.isState, true)
  t.equal(vstamp.cnt, 0, 'vstamp.cnt is zero')
  t.end()
})

test('async helpers', function (t) {
  const state = new State({}, false)
  t.equal(state.isState, true)
  t.equal(vstamp.cnt, 0, 'vstamp.cnt is zero')
  t.end()
})
