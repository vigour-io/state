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
        b: { '~': { james: true } }
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
    [ { path: 'b', type: 'update' } ],
    // just add the number colleciton change is way too small anyways

    // something(1) + james(2)
    { something: { $: 3, b: { $: 3 } }, james: 2 },
    { james: true }
  )

  t.end()
})
