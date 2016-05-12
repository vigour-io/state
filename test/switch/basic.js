'use strict'
const test = require('tape')
const subsTest = require('../test')

test.skip('switch - basic', (t) => {
  const subscription = {
    field: {
      $remove: true,
      $switch: {
        map  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'a') {
            return 'optionA'
          } else if (state.key === 'b') {
            return 'optionB'
          }
        },
        val: true,
        optionA: { a: { val: true } },
        optionB: { b: { val: true } }
      }
    }
  }
  const s = subsTest(
    t,
    {
      a: { a: 'its a/a' },
      b: { b: 'its b/b' }
    },
    subscription
  )
  const result = s('initial subscription', [], {})

  s(
    'set field to a',
    [
      { path: 'a', type: 'new', sType: 'switch' },
      { path: 'a/a', type: 'new' }
    ],
    {
      field: {
        $ref: result.state.a,
        $: 2,
        $switch: {
          $ref: result.state.a,
          $: subscription.field.$switch.optionA,
          a: {
            $: 1,
            $ref: result.state.a.a
          }
        }
      }
    },
    { field: '$root.a' }
  )

  s(
    'set field to b',
    [
      { path: 'a/a', type: 'remove-ref' },
      { path: 'b', type: 'update', sType: 'switch' },
      { path: 'b/b', type: 'new' }
    ],
    {
      field: {
        $ref: result.state.b,
        $: 3,
        $switch: {
          $ref: result.state.b,
          $: subscription.field.$switch.optionB,
          b: {
            $: 1,
            $ref: result.state.b.b
          }
        }
      }
    },
    { field: '$root.b' }
  )

  s(
    'set field to false',
    [
      { path: 'b/b', type: 'remove-ref' },
      { path: 'field', type: 'update', sType: 'switch' }
    ],
    {
      field: {
        $: 4,
        $switch: { $ref: result.state.field }
      }
    },
    { field: false }
  )

  s(
    'set field to a',
    [
      { path: 'a', type: 'update', sType: 'switch' },
      { path: 'a/a', type: 'new' }
    ],
    {
      field: {
        $ref: result.state.a,
        $: 5,
        $switch: {
          $ref: result.state.a,
          $: subscription.field.$switch.optionA,
          a: {
            $: 1,
            $ref: result.state.a.a
          }
        }
      }
    },
    { field: '$root.a' }
  )

  s(
    'remove field ',
    [
      { path: 'a/a', type: 'remove-ref' },
      { path: 'field', type: 'remove', sType: 'switch' }
    ],
    {},
    { field: null }
  )

  t.end()
})

test('switch - basic - direct', (t) => {
  const subscription = {
    field: {
      $remove: true,
      $switch: {
        map  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'a') {
            return 'optionA'
          } else if (state.key === 'b') {
            return 'optionB'
          }
        },
        val: true,
        optionA: { val: true },
        optionB: { val: true }
      }
    }
  }
  const s = subsTest(
    t,
    {
      a: 'its a/a',
      b: 'its b/b'
    },
    subscription
  )
  const result = s('initial subscription', [], {})

  var r = s(
    'set field to b',
    [
      { path: 'b', type: 'new', sType: 'switch' },
      { path: 'b', type: 'new' }
    ],
    false,
    { field: '$root.b' }
  )

  logTree(r.tree)

  t.end()

})


function logTree (tree, level, key) {
  console.log(indent(level) + (key ? key + ':' : '') + ' {')
  if (!level) {
    level = 0
  }
  for (let i in tree) {
    if (i !== '_p' && i !== '_key') {
      if (typeof tree[i] === 'object' && !tree[i]._base_version) {
        logTree(tree[i], level + 1, i)
      } else {
        console.log(indent(level + 1) + (i + ':' || '') + ' ' + (tree[i] && tree[i]._base_version ? tree[i].inspect() : tree[i]))
      }
    }
  }
  console.log(indent(level) + '}')
}
function indent (i) {
  var str = ''
  while (i) {
    i--
    str += '  '
  }
  return str
}