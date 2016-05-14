'use strict'
const test = require('tape')
const subsTest = require('./test')

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
            val: true,
            description: { val: true },
            rating: { val: true },
            title: { val: true }
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
        description: 'its about streets!',
        rating: 2
      },
      {
        title: 'interstellar',
        description: 'its about stars!',
        rating: 6
      }
    ]
  }

  const s = subsTest(t, state, subs, true)
  const r = s('initial subscription', [])

  console.log('jump query')
  r.state.query.set('jump')

  console.log('stellar query')
  r.state.query.set('stellar')

  console.log('jump street ---> stellar jumps')
  r.state.movies[0].title.set('stellar jumps')

  console.log('title to jumps -- fire remove!')
  r.state.movies[0].title.set('jumps')

  console.log('query to blargh')
  r.state.query.set('blargh')

  console.log('add movie "the blargh"')
  r.state.movies.set({
    2: {
      title: 'the blargh'
    }
  })

  t.end()
})

/*
extra /w references ofc
actors: {
  $any: {
    name: { val: true }
  }
}
*/