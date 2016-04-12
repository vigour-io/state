'use strict'
require('../style.less')
console.time('START')
// -------------------------
var raf = window.requestAnimationFrame
// -------------------------
var Observable = require('vigour-observable') // very slow init -- need to opmize
var subscribe = require('../../../subscribe')
var s = require('../../../s')
var vstamp = require('vigour-stamp')
var state = s({ name: 'trees' })
var obj = {}
for (var i = 0; i < 5; i++) {
  obj[i] = { title: i }
}
state.set({ collection: obj }, false)
// // -------------------------
var Property = new Observable({
  properties: {
    render (val) {
      // obviously need a compute cache
      // second argument has to work
      this.define({ render: val })
    }
  },
  Child: 'Constructor'
}).Constructor

var Element = new Observable({
  properties: {
    $: true, // this basiclly means field
    // hard thing is to get multiple fields on one level -- we will not support it
    $any: true,
    text: new Property({
      render (val) {
      }
    }),
    nodeType: true,
    state: true,
    _node: true
  },
  inject: [ require('./map'), require('./dom') ], // needs to be very different ofcourse
  Child: 'Constructor'
}).Constructor
// map is ofcourse wrong
// subscribe needs to work

// wtf to do
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
          text: { $: 'title', $prepend: 'title:' }
        }
      }
    },
    something: {
      anotherfield: {
        text: 'more text'
      },
      text: 'some text'
    }
  }
})

// what do i want out of this?
/*
  holder: {
    nested: {

    }
  }
*/

console.log(app.$map())

// properties just check for subscribers? not in the tree?
// what about having a prop subscirbed? no problem just use val: true
// when val true --> parse props ourselves or just make individual subs for them?
// this may be the prefered option

// -------------------------
console.timeEnd('START')
global.state = state
