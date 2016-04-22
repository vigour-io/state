'use strict'
require('./style.less')
console.time('START')
// -------------------------
// var raf = window.requestAnimationFrame
// -------------------------
var Observable = require('vigour-observable') // very slow init -- need to opmize
var subscribe = require('../../../subscribe')
var s = require('../../../s')
var state = s({ name: 'trees' })
var obj = {}
for (var i = 0; i < 2; i++) { obj[i] = { title: i } }
state.set({ collection: obj })
// // -------------------------
var Property = new Observable({
  properties: {
    $ (val) {
      this.$ = val
    },
    has$: true,
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
  inject: [
    require('./map'),
    // require('./render')
  ], // needs to be very different ofcourse
  Child: 'Constructor'
}, false).Constructor

var app = new Element({
  key: 'app',
  main: {
    // message: { text: 'hello' },
    holder: {
      $: 'collection',
      $any: true,
      Child: {
        // need to know that there is a deeper subs
        star: {},
        has$: true,
        title: {
          has$: true,
          text: { $: 'title' }
        },
        header: {
          has$: true,
          text: { $: 'title' }
        }
      }
    },
    // holder2: {
    //   $: 'collection',
    //   $any: true,
    //   Child: {
    //     has$: true,
    //     text: { $: 'title' }
    //   }
    // }
  },
  // menu: {
  //   button: { text: 'a button' },
  //   settings: {
  //     $: 'settings',
  //     button: { text: { $: 'languages' } }
  //   }
  // },
  // footer: {
  //   left: { text: 'on the left' },
  //   right: { text: 'on the right' }
  // }
}, false)

var subs = app.$map()

var render = require('./render')
// var elem = render.fn(app)
console.log(app)

var tree = {}

tree = subscribe(state, subs, function (type, stamp, subs, ctree, ptree) {
  console.log('FIRE', this.path(), type, subs)
  // console.log('tree:', tree)
  // console.log('ptree:', ptree)

  if (subs._) {
    render.fn(this, type, stamp, subs, ctree, ptree, tree)
  } else {
    console.warn('no _ ?', this.path())
  }
  // render.f
}, tree)
// -------------------------
console.log('subs:', subs)
// -------------------------
console.timeEnd('START')
global.state = state
global.tree = tree

console.log(tree._[app.uid()])
document.body.appendChild(tree._[app.uid()])
// something like rendered : true

// if i do this correctly dont need parent ever -- just need to store
// element and then find it by checking parent yes better
// document.appendChild(elem)
// tree.node or something...
