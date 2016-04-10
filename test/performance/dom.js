'use strict'
var Stats = require('stats-js')
var stats = new Stats()
stats.setMode(0)
document.body.appendChild(stats.domElement)
// -------------------------
var subscribe = require('../../subscribe')
var s = require('../../s')
var state = s({
  field: {
    something: 100
  }
})

var amount = 3e3


var obj = {}
for (var i = 0; i < amount; i++) {
  obj[i] = i
}
state.set({ collection: obj }, false)


var Observable = require('vigour-observable')
// -------------------------

var Element = new Observable({
  properties: {
    $: true,
    $any: true,
    text: true
  },
  inject: require('./map'),
  Child: 'Constructor'
}).Constructor

var app = new Element({
  key: 'app',
  a: {
    b: {
      $: [ 'field' ], // multiple need to be able to do that of course...
      c: {
        $: [ 'something' ],
        text: true
      }
    },
    c: {
      $: 'collection',
      $any: { val: true },
      Child: { text: true }
    }
  }
})

function walk (elem, key) {
  var node = document.createElement('div')
  node.className = key
  if (elem.$) { elem._node = node }
  elem.each(function (p) {
    node.appendChild(walk(p))
  })
  return node
}
// isnt it a million times easier to just parse the subs and show that??? this can be very very heavy im affraid

var appelem = walk(app)

console.warn('yo yo yo', app.$map())

// -------------------------

// need to batch it
function listen (type, stamp, subs, tree) {
  if (subs.$) {
    if (subs.$.$any) {
      if (subs.$.Child) {
        if (type === 'new') {
          var x = walk(subs.$.Child.prototype)
          if (subs.$.Child.prototype.text) {
            x.innerText = this.compute()
          }
          subs.$._node.appendChild(x)
          tree._node = x
        } else {
          if (tree._node && subs.$.Child.prototype.text) {
            tree._node.innerText = this.compute()
          }
        }
      }
    }
    if (subs.$.text) {
      subs.$._node.innerText = this.compute()
    }
  }
}
// -------------------------
// so what we want is a hidden tree??? -- its strange but also makes tons of sense

console.time('START')
// make this extra heavy
var ss = app.$map()
var tree = subscribe(
  state,
  ss,
  listen
)

console.log(appelem)
var coll = appelem.childNodes[0].childNodes[1]
var c = appelem.childNodes[0]
console.log(coll)

var x = 0

var raf = window.requestAnimationFrame
function run () {
  stats.begin()
  // ss.collection.$
  // c.innerHTML = ''
  // coll.outerHTML = ''
  // c.removeChild(coll)
  // coll.innerHTML = ''
  // coll = document.createElement('div')
  var obj = {}
  x++
  for (var i = 0; i < amount; i++) {
    obj[i] = i + x
  }
  app.a.c._node = coll
  // tree.collection._node = coll
  // state.set({ collection: obj })
  state.collection.set(obj)
  c.appendChild(coll)
  // console.log(coll)
  stats.end()
  raf(run)
  // console.timeEnd('update')
}

run()

document.body.appendChild(appelem)
console.timeEnd('START')

global.state = state
// -------------------------
console.log('TREE', tree)
console.log('START ' + amount)
