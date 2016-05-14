'use strict'
const test = require('tape')
const subsTest = require('./test')
const logger = require('./log')

test('condition', function (t) {
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
            val: 1,
            description: { val: true },
            title: { val: true },
            $root: {
              current: { val: true }
            }
          }
        }
      }
    }
  }

  const state = {
    query: 'interstellar',
    movies: [
      {
        title: 'jump street',
        description: 'its about streets!'
      },
      {
        title: 'interstellar',
        description: 'its about stars!'
      }
    ]
  }

  const s = subsTest(t, state, subs, true)

  const r = s('initial subscription', [
    { path: 'movies/1', type: 'new' },
    { path: 'movies/1/description', type: 'new' },
    { path: 'movies/1/title', type: 'new' }
  ])

  s('change query to "jump"', [
    { path: 'movies/0', type: 'new' },
    { path: 'movies/0/description', type: 'new' },
    { path: 'movies/0/title', type: 'new' },
    { path: 'movies/1', type: 'remove' }
  ], { query: 'jump' })

  s('change query to "stellar"', [
    { path: 'movies/0', type: 'remove' },
    { path: 'movies/1', type: 'new' },
    { path: 'movies/1/description', type: 'new' },
    { path: 'movies/1/title', type: 'new' }
  ], { query: 'stellar' })

  s('change title from "jump street" to "stellar jumps"', [
    { path: 'movies/0', type: 'new' },
    { path: 'movies/0/description', type: 'new' },
    { path: 'movies/0/title', type: 'new' }
  ], { movies: { 0: { title: 'stellar jumps' } } })

  s('change title from "stellar jumps" to "jump street"', [
    { path: 'movies/0', type: 'remove' }
  ], { movies: { 0: { title: 'jump street' } } })

  s('change query to "blargh"', [
    { path: 'movies/1', type: 'remove' }
  ], { query: 'blargh' })

  s('add movie "the blargh"', [
    { path: 'movies/2', type: 'new' },
    { path: 'movies/2/title', type: 'new' }
  ], { movies: { 2: { title: 'the blargh' } } })

  s(
    'add description for "the blargh"',
    [ { path: 'movies/2/description', type: 'new' } ],
    {
      movies: {
        2: {
          description: 'its about a monster, the blargh!'
        }
      }
    }
  )

  s(
    'change root/current fire for "the blargh"',
    [
      { path: 'current', type: 'new' },
      { path: 'movies/2', type: 'update' }
    ],
    { current: 'hello!' }
  )

  t.same(
    r.tree.movies[2].$c,
    { $condition: 'root', $pass: 'root' },
    'movies/2 has $c/$pass'
  )

  s(
    'change query to "somethig"',
    [ { path: 'movies/2', type: 'remove' } ],
    { query: 'something' }
  )

  t.same(
    r.tree.movies[2].$c,
    { $condition: 'root' },
    'movies/2 does not have $c/$pass'
  )

  t.end()
})
