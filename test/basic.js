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

test('basic - done', function (t) {
  const s = subsTest(
    t,
    { a: { b: 'its b!' } },
    {
      a: {
        $remove: true,
        val: true,
        done: true,
        b: { val: true }
      }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'a', type: 'new' },
      { path: 'a/b', type: 'new' },
      { path: 'a', type: 'new', sType: 'done' }
    ]
  )

  s(
    'update a/b',
    [
      { path: 'a', type: 'update' },
      { path: 'a/b', type: 'update' },
      { path: 'a', type: 'update', sType: 'done' }
    ],
    { a: { b: 'update b' } }
  )

  s(
    'remove a',
    [
      { path: 'a/b', type: 'remove' },
      { path: 'a', type: 'remove' },
      { path: 'a', type: 'remove', sType: 'done' }
    ],
    { a: null }
  )
  t.end()
})

test('basic - top', function (t) {
  t.plan(3)
  const s = require('../s')
  const state = s({ haha: true }, false)
  const cnt = { done: 0, new: 0, update: 0 }
  state.subscribe({ val: true, done: true }, function (target, type, stamp, subs, tree, sType) {
    if (sType) { cnt[sType]++ }
    cnt[type]++
  })
  state.set('lullz')
  t.equal(cnt.done, 2, 'fired done once')
  t.equal(cnt.new, 2, 'fired new twice')
  t.equal(cnt.update, 2, 'fired update twice')
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
