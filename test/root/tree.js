'use strict'
const test = require('tape')

test('root - tree', function (t) {
  const subsTest = require('../test')
  const subscription = {
    james: { hello: true },
    something: {
      a: {
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

  s('initial subscription', [])

  s(
    'set james hello to true',
    [
      { path: 'james/hello', type: 'new' },
      { path: 'james/hello', type: 'new' }
    ],
    { james: { hello: true } }
  )

  s('set james hello to false', [
    { path: 'james/hello', type: 'update' },
    { path: 'james/hello', type: 'update' }
  ], false, { james: { hello: false } })

  s(
    'set a to false',
    [],
    { something: { a: false } }
  )

  s('set b field', [
    { path: 'james', type: 'new' }
  ], false, { something: { b: true } })

  s('set b.c field', [
    { path: 'james/hello', type: 'new' }
  ], false, { something: { b: { c: true } } })

  s('set james hello to false', [
    { path: 'james/hello', type: 'update' },
    { path: 'james/hello', type: 'update' },
    { path: 'james', type: 'update' },
    { path: 'james/hello', type: 'update' }
  ], false, { james: { hello: true } })

  s(
    'remove something/b',
    [], // think about this do you really dont want to fire when root subs? probably yes
    { something: { b: null } }
  )
  t.end()
})
