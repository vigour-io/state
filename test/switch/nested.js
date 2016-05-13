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
          genre: {
            $switch: {
              val: true,
              map  (state, type, stamp, subs, tree, sType) {
                if (state.key === 'sexy') {
                  return 'sexy'
                } else if (state.key === 'cool') {
                  return 'cool'
                }
              },
              sexy: {
                title: { val: true }
              },
              cool: {
                description: { val: true }
              }
            }
          },
          done: true
        },
        title: {
          text: { val: true },
          val: true
        }
      }
    }
  }
  const s = subsTest(
    t,
    {
      target: false,
      title: {
        text: 'its a title!'
      },
      song: {
        genre: '$root.genres.sexy'
      },
      genres: {
        sexy: { title: 'steaming' },
        cool: { description: 'ice cold' }
      }
    },
    subscription
  )

  s('initial subscription', [], { target: { $: 1 } })

  s('swtich target to $root.title', [
    { path: 'title', type: 'new', sType: 'switch'},
    { path: 'title', type: 'new' },
    { path: 'title/text', type: 'new' },
  ], false, { target: '$root.title' })

  s('swtich target to $root.song', [
    { path: 'song', type: 'update', sType: 'switch'},
    { path: 'genres/sexy', type: 'new', sType: 'switch' },
    { path: 'genres/sexy/title', type: 'new' },
    { path: 'song', type: 'new', sType: 'done' }
  ], false, { target: '$root.song' })

  s('swtich song.genre to $root.genres.cool', [
    { path: 'genres/cool', type: 'update', sType: 'switch' },
    { path: 'genres/cool/description', type: 'new' }
  ], false, { song: { genre: '$root.genres.cool' } })

  t.end()
})
