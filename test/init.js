'use strict'
const test = require('tape')
const vstamp = require('vigour-stamp')

test('init', function (t) {
  const State = require('../') // eslint-disable-line
  const state = new State({}, false)
  t.equal(state.isState, true)
  t.equal(vstamp.cnt, 0, 'vstamp.cnt is zero')
  t.end()
})
