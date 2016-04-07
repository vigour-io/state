'use strict'
var test = require('tape')
var subsTest = require('./test')
var subscribe = require('../subscribe')

test('root subscription', function (t) {
  var subscription = {
    something: {
      // james: { hello: true },
      a: {
        // this should not fire!
        $root: { james: { hello: true } }
      },
      // b: {
      //   $root: { james: true },
      //   c: { $root: { james: { hello: true } } }
      // }
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

  t.end()
})
