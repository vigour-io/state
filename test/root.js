'use strict'
var test = require('tape')
var subsTest = require('./test')

test('root subscription', function (t) {
  var subs = subsTest(
    t,
    { something: true },
    {
      something: {
        a: true,
        b: { '~': { james: true } }
      }
    }
  )

  // if root (or parent) walk parent tree (wal till root obj)
  // add hasComposite:  //what does it have inside? prob a function

  subs(
    'create root field',
    [ { path: 'james', type: 'new' } ],
    { something: 1, james: 2 },
    { james: true }
  )

  t.end()
})
