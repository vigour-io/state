'use strict'
var test = require('tape')
var subsTest = require('./test')
var subscribe = require('../subscribe')

test('root subscription', function (t) {
  var subscription = {
    james: { hello: true },
    something: {
      a: {
        // this should not fire!
        $root: { james: { hello: true } }
      },
      b: {
        $root: { james: true },
        c: { $root: { james: { hello: true } } }
      }
    }
  }

  var subs = subsTest(
    t,
    {
      something: { a: true },
      james: true
    },
    subscription
  )

  subs(
    'initial subscription', [],
    {
      something: {
        $: 1,
        a: {
          $: 1,
          $r: {
            james: { hello: true }
          }
        },
        $c: { a: 'root' }
      },
      james: { $: 1 }
    }
  )

  subs(
    'set james hello to true',
    [
      { path: 'james/hello', type: 'new' },
      { path: 'something/a', type: 'update' }
    ],
    {
      something: {
        $: [ 2, 1 ],
        a: {
          $: [ 2, 1 ],
          $r: {
            james: {
              hello: true,
              $: 2
            },
            $: 2
          }
        },
        $c: {
          a: 'root',
          $: 2
        }
      },
      james: {
        $: 2,
        hello: 2
      }
    },
    { james: { hello: true } }
  )

  t.end()
})
