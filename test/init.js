'use strict'
const test = require('tape')
const vstamp = require('vigour-stamp')

test('init', function (t) {
  const State = require('../') // eslint-disable-line
  t.plan(1)
  t.equal(vstamp.cnt, 0, 'vstamp.cnt is zero')
})
