'use strict'
const test = require('tape')
const subsTest = require('../util')

test('test - basic', function (t) {
  const subs = {
    letters: {
      $any: {
        $test: {
          exec (state) {
            return state.compute() === 'a'
          },
          $pass: { val: true }
        }
      }
    }
  }

  const state = {
    letters: [ 'a', 'b', 'c' ]
  }

  const s = subsTest(t, state, subs)

  s('initial subscription', [
    { path: 'letters/0', type: 'new' }
  ])

  s(
    'change letters/2 to a',
    [
      { path: 'letters/2', type: 'new' }
    ],
    { letters: { 2: 'a' } }
  )

  t.end()
})

test('test - basic - nested root', function (t) {
  const subs = {
    y: {
      $root: {
        x: {
          $test: {
            exec (state) {
              return state.compute() > 50
            },
            $pass: { val: true }
          }
        }
      }
    }
  }
  const state = { x: 100, y: {} }
  const s = subsTest(t, state, subs)
  s('initial subscription', [
    { path: 'x', type: 'new' }
  ])
  s(
    'change bla to false',
    [
      { path: 'x', type: 'remove' }
    ],
    { x: 50 }
  )
  t.end()
})

test('test - basic - root', function (t) {
  const subs = {
    x: {
      '$test-X': {
        exec: (state) => state.compute() > 50,
        $pass: { $root: { bla: { val: true } } }
      }
    }
  }
  const state = { bla: true, x: 100 }
  const s = subsTest(t, state, subs)
  s('initial subscription', [
    { path: 'bla', type: 'new' }
  ])
  s(
    'change bla to false',
    [
      { path: 'bla', type: 'update' }
    ],
    { bla: false }
  )
  t.end()
})

function testRootParent (type) {
  test('test - basic - root + ' + type, function (t) {
    const subs = {
      x: {
        '$test-X': {
          exec: (state) => state.parent.y.compute() > 50,
          $: {
            [type]: {
              y: {}
            }
          },
          $pass: { val: true, $root: { bla: { val: true } } }
        }
      }
    }
    const state = { bla: true, x: 100, y: 100 }
    const s = subsTest(t, state, subs)
    s('initial subscription', [
      { path: 'x', type: 'new' },
      { path: 'bla', type: 'new' }
    ])

    s(
      'change bla to false',
      [
        { path: 'bla', type: 'update' },
        { path: 'x', type: 'update' }
      ],
      { bla: false }
    )

    s(
      'change y to 10',
      [
        { path: 'x', type: 'remove' }
      ],
      { y: 10 }
    )

    t.end()
  })
}
testRootParent('parent')
testRootParent('$parent')

test('test - basic - val new/remove', function (t) {
  const subs = {
    letters: {
      $any: {
        $test: {
          exec (state) {
            return state.n.compute() === state.root.query.compute() || !state.root.query.compute()
          },
          $pass: {
            val: 1,
            n: { val: true }
          },
          $: {
            n: {},
            $root: { query: {} }
          }
        }
      }
    }
  }

  const state = {
    query: 'a',
    letters: [ { n: 'a' }, { n: 'b' }, { n: 'c' }, { n: 'd' } ]
  }

  const s = subsTest(t, state, subs)

  s('initial subscription', [
    { path: 'letters/0', type: 'new' },
    { path: 'letters/0/n', type: 'new' }
  ])

  s(
    'change letters/1 to a',
    [
      { path: 'letters/1', type: 'new' },
      { path: 'letters/1/n', type: 'new' }
    ],
    { letters: { 1: { n: 'a' } } }
  )

  s(
    'change query to c',
    [
      { path: 'letters/0', type: 'remove' },
      { path: 'letters/1', type: 'remove' },
      { path: 'letters/2', type: 'new' },
      { path: 'letters/2/n', type: 'new' }
    ],
    { query: 'c' }
  )

  s(
    'change query to all',
    [
      { path: 'letters/0', type: 'new' },
      { path: 'letters/0/n', type: 'new' },
      { path: 'letters/1', type: 'new' },
      { path: 'letters/1/n', type: 'new' },
      { path: 'letters/3', type: 'new' },
      { path: 'letters/3/n', type: 'new' }
    ],
    { query: '' }
  )

  s(
    'change query to a',
    [
      { path: 'letters/2', type: 'remove' },
      { path: 'letters/3', type: 'remove' }
    ],
    { query: 'a' }
  )

  t.end()
})
