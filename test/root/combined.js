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
      },
      d: {
        e: {
          x: { $root: { hello: { val: true } } },
          y: { $root: { hello: { val: true } } }
        },
        f: {
          $root: { hello: { val: true } }
        }
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

  const r = s('remove something/b', [], { something: { b: null } })
  s('add something/d/e', [], { something: { d: { e: { x: {}, y: {} }, f: {} } } } )
  t.same(r.tree.something.$c, { d: 'root', a: 'root' }, 'got d and a in something/$c')
  t.same(r.tree.something.d.$c, { e: 'root', f: 'root' }, 'got e and f in something/d/$c')
  s('remove something/d/e/x', [], { something: { d: { e: { x: null } } } } )
  t.same(r.tree.something.d.$c, { e: 'root', f: 'root' }, 'got e and f in something/d/$c')
  s('remove something/d/e', [], { something: { d: { e: null } } } )
  t.same(r.tree.something.d.$c, { f: 'root' }, 'got f in something/d/$c')
  s('remove something/d', [], { something: { d: null } } )
  t.same(r.tree.something.$c, { a: 'root' }, 'got only a in something/$c')
  t.end()
})
