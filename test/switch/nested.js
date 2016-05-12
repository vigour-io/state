'use strict'
const test = require('tape')
const subsTest = require('../test')

test('switch - nested', (t) => {

  const subscription = {
    target: {
      $remove: true,
      $switch: {
        map  (state, type, stamp, subs, tree, sType) {
          if (state.key === 'song') {
            return 'song'
          } else if (state.key === 'title') {
            return 'title'
          }
        },
        val: true,
        song: {
          lyric: {
            $switch: {
              map  (state, type, stamp, subs, tree, sType) {
                if (state.key === 'sexy') {
                  return 'sexy'
                } else if (state.key === 'cool') {
                  return 'cool'
                }
              }
            },
            sexy: {
              title: true
            },
            cool: {
              description: true
            }
          }
        },
        title: {
          title: { val: true }
        }
      }
    }
  }
  const s = subsTest(
    t,
    {

    },
    subscription
  )
  const result = s('initial subscription', [], {})


  t.end()

})
