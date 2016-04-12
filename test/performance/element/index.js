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
console.log(vstamp)
var state = s({
  name: 'trees'
})
var obj = {}
for (var i = 0; i < 5; i++) {
  obj[i] = i
}
state.set({ collection: obj }, false)
// // -------------------------
var Element = new Observable({
  properties: {
    $: true, // this basiclly means field
    // hard thing is to get multiple fields on one level -- we will not support it
    $any: true,
    text: new Observable({
      on: {
        data (val, stamp) {
          console.log('this is a text letz go!!!', stamp)
        }
      }
    }),
    nodeType: true,
    state: true,
    _node: true
  },
  inject: require('../map'), // needs to be very different ofcourse
  Child: 'Constructor'
}).Constructor
// map is ofcourse wrong
// subscribe needs to work

// wtf to do

var app = new Element({
  holder: {
    nested: {
      collection: {
        $: 'field',
        $any: true,
        Child: {
          dot: {
            field: {
              text: 'hello this is not a subscription'
            }
          },
          text: { $: 'title' }
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

// so this thing need to get a tree to nested --
// no not? nope
/*
tree: {



}
*/



// -------------------------
console.timeEnd('START')
global.state = state
