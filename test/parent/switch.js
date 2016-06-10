'use strict'
const test = require('tape')
const subsTest = require('../util')
const field = require('../util/field')

module.exports = function (type) {
  test(type + ' - $switch', function (t) {
    const subscription = field({
      nest: {
        field: {
          $switch: {
            exec  (state, type, stamp, subs, tree, sType) {
              if (state.key === 'a') {
                return 'optionA'
              } else if (state.key === 'b') {
                return 'optionB'
              } else if (state.key === 'c') {
                return 'optionC'
              }
            },
            optionA: { $parent: { bla: { val: true } } },
            optionB: { $parent: { $parent: { etc: { val: true } } } },
            optionC: { val: true } // should fire wtf...
          }
        }
      }
    }, type, '$parent')

    const s = subsTest(
      t,
      {
        etc: true,
        nest: {
          bla: { val: true },
          a: {},
          b: {},
          c: 'hello',
          field: '$root.nest.a'
        }
      },
      subscription
    )

    const r = s('initial subscription', [ { path: 'nest/bla', type: 'new' } ])
    t.same(r.tree.nest.field.$switch.$c, { [type]: type }, 'got correct $c')
    s(
      'change to c (remove parent subs)',
      [ { path: 'nest/c', type: 'new' } ],
      { nest: { field: '$root.nest.c' } }
    )
    t.equal(r.tree.nest.field.$switch.$c, void 0, 'removed field.$switch.$c')
    s(
      'change to b (double parent)',
      [ { path: 'etc', type: 'new' } ],
      { nest: { field: '$root.nest.b' } }
    )
    s(
      'change to c (remove parent subs)',
      [ { path: 'nest/c', type: 'new' } ],
      { nest: { field: '$root.nest.c' } }
    )
    t.equal(r.tree.nest.field.$switch.$c, void 0, 'removed field.$switch.$c')
    t.equal(r.tree.nest.field.$c, void 0, 'removed field.$c')
    t.end()
  })
}
