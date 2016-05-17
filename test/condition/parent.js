'use strict'
const test = require('tape')
const subsTest = require('../test')

test('condition - parent', function (t) {
  const subs = {
    movies: {
      $any: {
        $condition: {
          val (state) {
            var query = state.getRoot().query.compute()
            if (query && state.title) {
              return (state.title.compute().indexOf(query) > -1)
            }
          },
          $subs: {
            title: {},
            $root: { query: {} }
          },
          $pass: {
            val: 1, // 1 should not fire!
            title: { val: true },
            $parent: {
              title: { val: true }
            }
          }
        }
      }
    }
  }

  const state = {
    query: 'interstellar',
    movies: {
      interstellar: {
        title: 'interstellar'
      },
      title: 'hello'
    }
  }

  const s = subsTest(t, state, subs)

  s('initial subscription', [
    { path: 'movies/interstellar', type: 'new' },
    { path: 'movies/interstellar/title', type: 'new' },
    { path: 'movies/title', type: 'new' }
  ])

  s(
    'update movies/title',
    [
      { path: 'movies/title', type: 'update' }
    ],
    { movies: { title: 'hey' }
  })

  t.end()
})
