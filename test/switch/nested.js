'use strict'
const test = require('tape')
const subsTest = require('../test')

test('switch - nested', (t) => {

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


  t.end()

})
