'use strict'
require('./style.less')
// -------------------------
var raf = window.requestAnimationFrame
// -------------------------
var subscribe = require('../../subscribe')
var s = require('../../s')
var state = s({
  field: {
    name: 'dbDevil',
    ms: { val: 0, $add: ' ms (js exec time)' },
    amount: {
      val: 100,
      $transform (val) { return val > -1 && val < 2e4 ? val : 100 }
    },
    fps: { val: 0, $add: ' fps' }
  }
})
var obj = {}
for (var i = 0; i < state.field.amount.compute(); i++) {
  obj[i] = i
}
state.set({ collection: obj }, false)
// -------------------------
var Observable = require('vigour-observable')
var Element = new Observable({
  properties: {
    $: true,
    $any: true,
    text: true,
    nodeType: true,
    state: true
  },
  inject: require('./map'),
  Child: 'Constructor'
}).Constructor

var app = new Element({
  key: 'app',
  a: {
    b: {
      $: [ 'field' ], // multiple need to be able to do that of course...
      name: {
        $: [ 'name' ],
        text: true
      },
      amount: {
        $: [ 'amount' ],
        text: true,
        nodeType: 'textarea',
        on: {
          keyup () {
            this.state.set(this._node.value)
          }
        }
      },
      fps: {
        $: [ 'fps' ],
        text: true
      },
      ms: {
        $: [ 'ms' ],
        text: true
      }
    },
    c: {
      $: 'collection',
      $any: { val: true },
      Child: {
        css: {
          $transform (val) {
            if (val > 990) {
              return 'thing color'
            }
            return 'thing'
          }
        },
        text: true
      }
    }
  }
})

function walk (elem) {
  var node = document.createElement(elem.nodeType || 'div')
  node.className = elem.key
  if (elem._on) {
    if (elem._on.keyup) {
      // wtf is the difference...gi
      console.log('---->', elem._on.keys())
    }
    elem._on.each((p, key) => {
      node.addEventListener(key, function (e) {
        p.fn.val.call(elem, e)
      })
    })
  }
  if (elem.$) { elem._node = node }
  elem.each(function (p) {
    node.appendChild(walk(p))
  })
  return node
}

var appelem = walk(app)

/*
  few cases
  refs and switcher using property defintionw
  DONT WANT TO DO TREE FOR NON-CHANGING DOM HANDLES
*/

// -------------------------
// need to batch it
function listen (type, stamp, subs, tree) {
  if (subs.$) {
    if (subs.$.$any) {
      var proto = subs.$.Child.prototype
      if (proto) {
        if (type === 'remove') {
          if (tree._node) {
            tree._node.parentNode.removeChild(tree._node)
          }
        } else if (type === 'new') {
          var x = walk(proto)
          if (proto.text) {
            x.innerText = this.compute()
          }
          subs.$._node.appendChild(x)
          tree._node = x
        } else {
          if (tree._node && proto.text) {
            let v = this.compute()
            tree._node.innerText = v
            if (proto.css) {
              // not very nice tbh make it the second argument perhaps liked prev value better
              tree._node.className = proto.css.compute(v)
            }
          }
        }
      }
    }
    if (subs.$.text) {
      if (subs.$.nodeType === 'textarea') {
        subs.$._node.value = this.compute()
      } else {
        subs.$._node.innerText = this.compute()
      }
    }
    if (subs.$._on._keys) {
      subs.$.state = this
    }
  }
}
// -------------------------
console.time('START')
// -------------------------
var tree = subscribe(state, app.$map(), listen)
var ms = Date.now()
var lcompute = state.field.amount.compute()
var cnt = 0
function run () {
  var obj = {}
  var startms = Date.now()
  var c = state.field.amount.compute()
  if (lcompute > c) {
    for (let i = 0; i < lcompute; i++) {
      // temp can be fixed better -- e.g in the handler
      obj[i] = null
    }
  }
  for (let i = 0; i < c; i++) {
    obj[i] = Math.round(Math.random() * 1000)
  }
  lcompute = c
  state.set({
    field: { fps: Math.round(1000 / (Date.now() - ms)) },
    collection: obj
  })
  state.field.ms.set(Date.now() - startms)
  ms = Date.now()
  raf(run)
}
// -------------------------
document.body.appendChild(appelem)
run()
// -------------------------
console.timeEnd('START')
global.state = state
console.log('TREE', tree)
