'use strict'
import Observable from 'vigour-observable' // very slow init -- need to opmize
import subscribe from '../../../subscribe'
import s from '../../../s'

require('./style.less')
console.time('START')
// -------------------------
const raf = window.requestAnimationFrame
const isNumber = require('vigour-util/is/number')
// -------------------------
const state = s({ name: 'trees' })
const obj = {}
for (var i = 0; i < 2; i++) { obj[i] = { title: i } }
state.set({
  collection: obj,
  ms: {
    $transform (val) {
      return isNumber(val) ? Math.round(val) : 'not measured'
    },
    $add: ' ms'
  },
  settings: {}
})
// // -------------------------
const Property = new Observable({
  properties: {
    $ (val) {
      this.$ = val
    },
    noState: true,
    render (val) {
      this.define({ render: val })
    }
  },
  inject: require('./map'),
  Child: 'Constructor'
}, false).Constructor

const Element = new Observable({
  type: 'element',
  properties: {
    css: true,
    noState: true,
    $: true, // this basicly means field or path
    // hard thing is to get multiple fields on one level -- we will not support it
    $any: true,
    text: new Property({
      render (node, state, tree, type) {
        // different later
      }
    }),
    nodeType: true,
    state: true,
    _node: true
  },
  inject: [
    require('./map')
    // require('./render')
  ], // needs to be very different ofcourse
  Child: 'Constructor'
}, false).Constructor

var app = new Element({
  key: 'app',
  star: {},
  holder: {
    ms: {
      text: { $: 'ms' }
    },
    elems: {
      text: { $: 'elems', $add: ' dom-nodes' }
    }
  },
  main: {
    holder2: {
      $: 'collection',
      $any: true,
      Child: { // if you reuse here stuff here as a Child uid is not enough!
        css: 'weirdChild',
        text: { $: 'title' }
      }
    },
    holder: {
      $: 'collection',
      $any: true,
      Child: {
        css: 'nestchild',
        on: {
          // on data as well?
          remove (val, stamp, node) {
            console.log('FIRE REMOVE:', val, stamp, node)
          }
        },
        star: {},
        something: {
          a: {
            b: {
              c: {}
            }
          }
        },
        title: {
          text: { $: 'title' }
        },
        // more: {
        //   text: { $: '$root.ms' } -- root is not yet supported
        // },
        header: {
          a: {
            text: {
              $: 'title',
              $transform (val) {
                return val
              }
            }
          }
        }
      }
    }
  },
  menu: {
    // this needs to be rendered of course -- even if there is no data -- else its pretty strange
    // for now we cna work arround this (leave it!) but alter we need to change this
    // it just weird that if there is a state it allways takes over and takes care of the handeling
    button: { text: 'a button' },
    settings: {
      $: 'settings',
      button: { text: { $: 'languages' } }
    }
  },
  footer: {
    left: { text: 'on the left' },
    right: { text: 'on the right' }
  }
}, false)

var subs = app.$map()

var render = require('./render')

var tree = {}

tree = subscribe(state, subs, function (type, stamp, subs, ctree, ptree) {
  // console.group()
  // console.log('FIRE', this.path(), type, subs)
  // console.log('tree:', tree)
  // console.log('ptree:', ptree)
  // ctree._parent = ptree
  if (subs._) {
    render.fn(this, type, stamp, subs, ctree, ptree, tree)
  } else {
    console.warn('no _ ?', this.path())
  }
  // console.groupEnd()
  // render.f
}, tree)
// -------------------------
console.log('subs:', subs)
// -------------------------
console.timeEnd('START')
global.state = state
global.tree = tree
global.subs = subs
console.log(tree._[app.uid()])
document.body.appendChild(tree._[app.uid()])
var cnt = 0
var total = 0
function loop () {
  cnt++
  var ms = Date.now()
  var obj = {}
  for (var i = 0; i < 1e3; i++) { obj[i] = { title: i + cnt } }
  state.collection.set(obj)
  total += (Date.now() - ms)
  state.ms.set(total / cnt)
  raf(loop)
}

// state.collection[0].remove()
loop()

console.log('----------------------------')
state.set({ elems: document.getElementsByTagName('*').length })
// if i do this correctly dont need parent ever -- just need to store
// element and then find it by checking parent yes better
// document.appendChild(elem)
// tree.node or something...
