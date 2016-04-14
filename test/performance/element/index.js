'use strict'
require('../style.less')
console.time('START')
// -------------------------
var raf = window.requestAnimationFrame
// -------------------------
var Observable = require('vigour-observable') // very slow init -- need to opmize
var subscribe = require('../../../subscribe')
var s = require('../../../s')
var state = s({ name: 'trees' })
var obj = {}
for (var i = 0; i < 2; i++) {
  obj[i] = { title: i }
}
state.set({ collection: obj })
// // -------------------------
var Property = new Observable({
  properties: {
    $: true,
    render (val) {
      this.define({ render: val })
    }
  },
  inject: require('./map'),
  Child: 'Constructor'
}, false).Constructor

var Element = new Observable({
  type: 'element',
  properties: {
    $: true, // this basicly means field or path
    // hard thing is to get multiple fields on one level -- we will not support it
    $any: true,
    text: new Property({
      render (node, state, tree, type) {
        // state or val ----
        console.log('should render this prop', this.path())
        console.log(node, state)
        if (node) {
          node.innerText = this.compute(state)
        } else {
          console.error('wtf wtf!', node, state.path())
        }
      }
    }),
    nodeType: true,
    state: true,
    _node: true
  },
  inject: [ require('./map'), require('./render') ], // needs to be very different ofcourse
  Child: 'Constructor'
}, false).Constructor

var app = new Element({
  holder: {
    nested: {
      collection: {
        $: 'collection',
        $any: true,
        Child: {
          dot: {
            field: {
              text: 'hello this is not a subscription'
            }
          },
          texting: {
            text: { $: 'title', $prepend: 'title:' }
          }
        }
      }
    },
    something: {
      anotherfield: {
        text: 'more text'
      },
      field: {
        text: 'some text'
      }
    }
  }
}, false)

var subs = app.$map()
console.log('go render!')
var elem = app.render()
console.log('ELEM:', elem)
console.log('go subs!')

var tree = subscribe(state, subs, function (type, stamp, subs, tree, ptree) {
  // or just add parent in trees... many times easier
  // update.call(keyTarget, INIT, stamp, subs, treeKey)
  // this is it
  console.log('FIRE', this.path(), type, subs)
  console.log('tree:', tree)
  console.log('ptree:', ptree)
  // tree, ptree

  // this is interesting
  if (subs._) {
    if (subs._.render) {
      // need parent
      subs._.render(subs._.parent._node, this, tree)
      // need previous value here then we are good!
    } else if (subs._.$any) {
      // something like collection flag or something
      // how to find dat node

      // (subs._.$parent._node find it!!!
      subs._.$any.prototype.render(false, this, tree)
    } else {
      console.warn('?')
    }
  } else {
    console.error('!', subs)
  }
})

// document.body.appendChild(elem)

console.log('tree:', tree)
// properties just check for subscribers? not in the tree?
// what about having a prop subscirbed? no problem just use val: true
// when val true --> parse props ourselves or just make individual subs for them?
// this may be the prefered option
// -------------------------
console.timeEnd('START')
global.state = state
