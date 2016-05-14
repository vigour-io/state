'use strict'
const test = require('tape')
const subsTest = require('../test')

test('root - combined', function (t) {
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

test('root - combined - normal subscription', function (t) {
  const subs = {
    a: {
      val: true,
      b: {
        $root: { b: { val: true } }
      }
    }
  }
  const s = subsTest(t, { a: { b: {} }, b: true }, subs)
  s(
    'set b',
    [
      { path: 'b', type: 'update' },
      { path: 'a', type: 'update' }
    ],
    { b: 'hello!' }
  )
  t.end()
})

test('root - combined - collection - normal subscription', function (t) {
  const subscription = {
    a: {
      val: true,
      $any: {
        $root: {
          b: { val: true }
        }
      }
    }
  }
  const a = [ 1, 2, 3, 4 ]
  const s = subsTest(t, { a: a, b: 'hello b!' }, subscription)
  const creation = multiple('new')
  creation.unshift({ path: 'a', type: 'new'})
  s('initial subscription', creation)
  const update = multiple('update')
  // order changes since we dont know before hand if a composite updates -- this is hard to change!
  update.push({ path: 'a', type: 'update' })
  s('set b', update, { b: 'hello b2!' })
  t.end()
  function multiple (type) {
    const val = []
    for (let i = 0, len = a.length; i < len; i++) {
      val.push({ type: type, path: 'b' })
    }
    return val
  }
})

test('root - combined - collection - normal subscription -- done', function (t) {
  const subscription = {
    a: {
      done: true,
      $any: {
        $root: {
          b: { val: true }
        }
      }
    }
  }
  const a = [ 1, 2, 3, 4 ]
  const s = subsTest(t, { a: a, b: 'hello b!' }, subscription)
  const creation = multiple('new')
  // done at the end
  creation.push({ path: 'a', type: 'new'})
  s('initial subscription', creation)
  const update = multiple('update')
  // order changes since we dont know before hand if a composite updates -- this is hard to change!
  update.push({ path: 'a', type: 'update' })
  s('set b', update, { b: 'hello b2!' })
  t.end()
  function multiple (type) {
    const val = []
    for (let i = 0, len = a.length; i < len; i++) {
      val.push({ type: type, path: 'b' })
    }
    return val
  }
})