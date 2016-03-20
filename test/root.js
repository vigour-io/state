'use strict'
var test = require('tape')
var subsTest = require('./test')
var Event = require('vigour-event')

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
    {
      something: {
        $: [1, 2],
        $r: { james: { val: true, $: 2 } },
        // dont do double better to add to james -- at least share the $r from father to child
        b: { $: [1, 2], $r: { james: { val: true, $: 2 } } }
      }
    },
    { james: true }
  )

  console.log('#second update')

  subs('update james',
    [ { path: 'something/b', type: 'update' } ],
    {
      something: {
        $: [1, 3],
        $r: { james: { val: true, $: 3 } },
        // dont do double better to add to james -- at least share the $r from father to child
        b: { $: [1, 3], $r: { james: { val: true, $: 3 } } }
      }
    },
    { james: false }
  )

  t.end()
})
