'use strict'
const test = require('tape')
const subsTest = require('../util')
test('root - switch', function (t) {
  const subscription = {
    target: {
      $switch: {
        exec  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'a') {
            return 'optionA'
          } else if (state.key === 'b') {
            return 'optionB'
          } else {
            return 'optionC'
          }
        },
        optionA: {
          a: {
            val: true,
            $root: { b: { val: true } }
          }
        },
        optionB: {
          b: { val: true }
        },
        optionC: {
          $remove: true,
          c: {
            val: true,
            $root: { b: { val: true } }
          }
        }
      }
    }
  }
  const s = subsTest(
    t,
    {
      a: { a: 'its a/a' },
      b: { b: 'its b/b' },
      c: { c: 'ites c/c' }
    },
    subscription
  )
  const result = s('initial subscription', [], {})
  s('switch target to $root/a', [
    { path: 'a/a', type: 'new' },
    { path: 'b', type: 'new' }
  ], { target: '$root.a' })
  t.equal('$c' in result.tree.target, true, 'target has $c')
  s('switch target to $root/b', [
    { path: 'b/b', type: 'new' }
  ], { target: '$root.b' })
  t.equal('$c' in result.tree.target, false, 'target removed $c')
  s('switch target to $root/c', [
    { path: 'c/c', type: 'new' },
    { path: 'b', type: 'new' }
  ], { target: '$root.c' })
  t.equal('$c' in result.tree.target, true, 'target has $c')
  s('switch target to $root/b', [
    { type: 'remove' },
    { path: 'b/b', type: 'new' }
  ], { target: '$root.b' })
  t.equal('$c' in result.tree.target, false, 'target removed $c')
  t.end()
})
