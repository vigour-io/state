'use strict'
const test = require('tape')
const subsTest = require('./test')

test('root - basic', function (t) {
  console.log('lets do this biatch!')
  const State = require('../lib')
  const s = new State({
    a: true
  })
  s.subscribe({
    a: {
      $root: {
        b: { val: true } // val true wrong?
      }
    }
  }, function (type) {
    console.log('yo yo yo', this, type)
  })

  console.log('----> set b!')
  s.set({
    b: 'hello b!'
  })

  // console.log('its a!')
  // console.log('----> set a!')
  // s.set({a: false})

  t.end()
})

test.skip('root - complex', function (t) {
  const subscription = {
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

  const s = subsTest(
    t,
    {
      something: { a: true },
      james: true
    },
    subscription
  )

  s(
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

  s(
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

  s('set james hello to false', [
    { path: 'james/hello', type: 'update' },
    { path: 'something/a', type: 'update' }
  ], false, { james: { hello: false } })

  s(
    'set a to false',
    [],
    {
      something: {
        $: [ 4, 4 ],
        a: {
          $: [ 3, 4 ],
          $r: {
            james: {
              hello: true,
              $: 3
            },
            $: 3
          }
        },
        $c: {
          a: 'root',
          $: 4
        }
      },
      james: {
        $: 3,
        hello: 3
      }
    },
    { something: { a: false } }
  )

  s('set b field', [
    { path: 'something/b', type: 'new' }
  ], false, { something: { b: true } })

  s('set b.c field', [
    { path: 'something/b/c', type: 'new' }
  ], false, { something: { b: { c: true } } })

  s('set james hello to false', [
    { path: 'james/hello', type: 'update' },
    { path: 'something/a', type: 'update' },
    { path: 'something/b', type: 'update' },
    { path: 'something/b/c', type: 'update' }
  ], false, { james: { hello: true } })

  s(
    'remove something/b',
    [], // think about this do you really dont want to fire when root subs? probably yes
    {
      james: {
        $: 7,
        hello: 7
      },
      something: {
        // 6 is self, 7 from b, 7 from a (both from root/james)
        $: [ 9, 8, 7 ],
        a: {
          $: [ 4, 7 ],
          $r: {
            james: {
              hello: true,
              $: 7
            },
            $: 7
          }
        },
        $c: {
          a: 'root',
          $: 8, // how does this one get build up??? (it is 8 but dont understand) so it becomes 8 -- the number of c
          $$: [ 9, 7 ] // this is the calculated cache
        }
      }
    },
    { something: { b: null } }
  )
  // removal has to remove tree
  t.end()
})
