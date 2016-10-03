'use strict'
const test = require('tape')
const State = require('../')

test('force - basic', t => {
  const state = new State({
    a: {
      b: {
        c: {
          d: '$root.b'
        }
      }
    },
    b: {
      title: 'its b',
      c: {
        d: {
          e: 'its e'
        }
      }
    }
  })
  const arr = []
  state.subscribe({
    a: {
      b: {
        c: {
          d: {
            title: { val: true },
            c: {
              d: {
                e: { val: true }
              }
            }
          }
        }
      }
    }
  }, state => arr.push(state.path()))

  var forceObj = {
    [state.a.sid()]: true, // option to add stamp when nessecary -- maybe clean
    [state.a.b.sid()]: true,
    [state.a.b.c.sid()]: true,
    [state.a.b.c.d.sid()]: true,
    [state.b.title.sid()]: true,
    [state.b.c.sid()]: true,
    [state.b.c.d.sid()]: true,
    [state.b.c.d.e.sid()]: true
  }

  state.emit('subscription', forceObj)

  t.same(arr, [
    [ 'b', 'title' ],
    [ 'b', 'c', 'd', 'e' ],
    [ 'b', 'title' ],
    [ 'b', 'c', 'd', 'e' ]
  ], 'forces correct updates')

  t.end()
})

test('force - switch, root and test', t => {
  var arr = []

  const state = new State({
    b: {
      title: 'it\'s b',
      c: { d: 'hello' }
    },
    items: [
      { title: '#1', description: 'its #1' },
      { title: '#2', description: 'its #2' }
    ],
    field: '$root.b'
  })

  const subs = {
    field: {
      $switch: {
        exec: state => state.key,
        b: {
          val: 1,
          title: { val: true },
          c: { d: { val: true } },
          $root: {
            items: {
              $any: {
                $test: {
                  exec: val => true,
                  $: {
                    title: { val: true }
                  },
                  $pass: {
                    title: { val: true },
                    description: { val: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  state.subscribe(subs, state => arr.push(state.path()))
  var forceObj = {
    [state.items.sid()]: true,
    [state.items[0].sid()]: true,
    [state.items[1].sid()]: true,
    [state.items[0].title.sid()]: true,
    [state.items[1].title.sid()]: true,
    [state.items[0].description.sid()]: true,
    [state.items[1].description.sid()]: true
  }
  arr = []
  state.emit('subscription', forceObj)

  t.same(
    arr,
    [
      [ 'items', '0', 'title' ],
      [ 'items', '0', 'description' ],
      [ 'items', '1', 'title' ],
      [ 'items', '1', 'description' ]
    ], 'refires collection over switch, root and test'
  )

  t.end()
})
