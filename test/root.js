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
    { something: { $: 1, b: { $: 1 } } }
  )

  // if root (or parent) walk parent tree (wal till root obj)
  // add hasComposite:  //what does it have inside? prob a function

  subs(
    'create root field',
    [ { path: 'b', type: 'update' } ], // or new?
    // something(1) + james(2)
    // only use val for leafs? for now at least for composite subs
    {
      something: {
        $: 3,
        $r: { james: { val: true } }, // is more speficic
        b: { $: 3, $r: { james: { val: true } } } // how to do the up-walking
      },
      james: 2
    },
    { james: true }
  )

  t.end()
})
