'use strict'
const test = require('tape')

test('root - combined', function (t) {
  const subsTest = require('../test')
  const subscription = {
    james: { hello: { val: true } },
    something: {
      a: {
        $root: { james: { hello: { val: true } } }
      },
      b: {
        $root: { james: { val: true } },
        c: { $root: { james: { hello: { val: true } } } }
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
  ], { james: { hello: false } })

  s(
    'set a to false',
    [],
    { something: { a: false } }
  )

  s('set b field', [
    { path: 'james', type: 'new' }
  ], { something: { b: true } })

  s('set b.c field', [
    { path: 'james/hello', type: 'new' }
  ], { something: { b: { c: true } } })

  s('set james hello to false', [
    { path: 'james/hello', type: 'update' },
    { path: 'james/hello', type: 'update' },
    { path: 'james', type: 'update' },
    { path: 'james/hello', type: 'update' }
  ], { james: { hello: true } })

  s(
    'remove something/b',
    [], // think about this do you really dont want to fire when root subs? probably yes
    { something: { b: null } }
  )
  t.end()
})
