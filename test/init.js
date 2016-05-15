'use strict'
const test = require('tape')
const vstamp = require('vigour-stamp')
const subsTest = require('./test')

test('init', function (t) {
  const State = require('../')
  const state = new State({}, false)
  t.plan(1)
  t.equal(vstamp.cnt, 0, 'vstamp.cnt is zero')
})
