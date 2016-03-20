'use strict'
var test = require('tape')
var subsTest = require('./test')

test('root subscription', function (t) {
  var subs = subsTest(
    t,
    { something: { b: true } },
    {
      something: {
        a: true,
        b: { '~': { james: true } } // can be more but does not matter
      }
    }
  )

  subs(
    'initial subscription', [],
    {
      something: {
        $: 1,
        $r: { james: { val: true } },
        b: {
          $: 1,
          $r: { james: { val: true } }
        }
      }
    }
  )

  console.log('#handle update')

  subs(
    'create root field',
    [ { path: 'something/b', type: 'update' } ],
    // something(1) + james(2)
    {
      something: {
        $: [1, 2],
        $r: { james: { val: true, $: 2 } },
        b: { $: [1, 2], $r: { james: { val: true, $: 2 } } }
      }
      // james: 2 <-- this will become the prefered way
    },
    { james: true }
  )

  t.end()
})
