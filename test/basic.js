'use strict'
const test = require('tape')
const Observable = require('vigour-observable')
const subsTest = require('./util')

test('basic', function (t) {
  const s = subsTest(
    t,
    { field: true },
    {
      field: { val: true },
      other: { yuzi: { val: true } }
    }
  )

  s(
    'initial subscription',
    [{ path: 'field', type: 'new' }]
  )

  s(
    'update nested field',
    [ { path: 'other/yuzi', type: 'new' } ],
    { other: { yuzi: true } }
  )

  s(
    'remove field',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { other: { yuzi: null } }
  )

  s(
    'reset yuzi',
    [ { path: 'other/yuzi', type: 'new' } ],
    { other: { yuzi: true } }
  )

  s(
    'remove other, no nested removal',
    [],
    { other: null }
  )

  t.end()
})

test('basic - nested removal', function (t) {
  const s = subsTest(
    t,
    { field: true, other: { yuzi: true } },
    {
      field: { val: true },
      other: { yuzi: { val: true }, $remove: true }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'field', type: 'new' },
      { path: 'other/yuzi', type: 'new' }
    ]
  )
  s(
    'remove and nested removal',
    [
      { path: 'other/yuzi', type: 'remove' }
    ],
    { other: null }
  )
  t.end()
})

test('basic - top', function (t) {
  t.plan(2)
  const s = require('../s')
  const state = s({ haha: true }, false)
  const cnt = { new: 0, update: 0 }
  state.subscribe({ val: true }, function (target, type, stamp, subs, tree, sType) {
    if (sType) { cnt[sType]++ }
    cnt[type]++
  })
  state.set('lullz')
  t.equal(cnt.new, 1, 'fired new twice')
  t.equal(cnt.update, 1, 'fired update twice')
})

test('basic - subscribe method', function (t) {
  t.plan(5)
  const s = require('../s')
  const state = s({ 1: true }, false)
  const obs = new Observable()
  state.subscribe({ 1: { val: true } }, function (target, type, stamp) {
    t.equal(target, state[1], 'correct state')
    t.equal(type, 'new', 'correct type')
    t.equal(stamp, 0, 'correct stamp')
  }, void 0, void 0, obs)
  t.equal('attach' in state.emitters.subscription, true, 'has observable attached')
  obs.remove()
  t.same(
    state.emitters.subscription.attach.keys(),
    [],
    'removing observable removes subscription'
  )
  state[1].set('hello!')
})
