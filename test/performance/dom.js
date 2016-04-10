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
      }
    },
    c: {
      $: 'collection',
      $any: { val: true },
      Child: {
        css (val) {
          if (val > 990) {
            return 'thing color'
          }
          return 'thing'
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
      elem._on._keys = null
      // console.log('---- this is wrong in obs / base fix it!!! -----')
    }
    elem._on.each((p, key) => {
      node.addEventListener(key, function (e) {
        // create stamp
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
// isnt it a million times easier to just parse the subs and show that??? this can be very very heavy im affraid
var appelem = walk(app)
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
    if (subs.$._on.keyup) {
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
function run () {
  var obj = {}
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
  state.collection.set(obj)
  state.field.fps.set(Math.round(1000 / (Date.now() - ms)))
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
