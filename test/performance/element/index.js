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
// var state = s({
//   name: 'trees'
// })
// var obj = {}
// for (var i = 0; i < 5; i++) {
//   obj[i] = i
// }
// state.set({ collection: obj }, false)
// // -------------------------
// var Element = new Observable({
//   properties: {
//     $: true,
//     $any: true,
//     text: true,
//     nodeType: true,
//     state: true,
//     _node: true
//   },
//   inject: require('../map'), // needs to be very different ofcourse
//   Child: 'Constructor'
// }).Constructor

// // so we store nodes on the element directly (when its nessecary)



// var app = new Element({
//   key: 'app'

// })

// function walk (elem) {
//   var node = document.createElement(elem.nodeType || 'div')
//   node.className = elem.key
//   if (elem._on) {
//     elem._on.each((p, key) => {
//       node.addEventListener(key, function (e) {
//         p.fn.val.call(elem, e)
//       })
//     })
//   }
//   if (elem.$) { elem._node = node }
//   elem.each(function (p) {
//     node.appendChild(walk(p))
//   })
//   return node
// }
// // isnt it a million times easier to just parse the subs and show that??? this can be very very heavy im affraid
// var appelem = walk(app)

// /*
//   few cases
//   refs and switcher using property defintionw
//   DONT WANT TO DO TREE FOR NON-CHANGING DOM HANDLES
// */

// // -------------------------
// // need to batch it
// function listen (type, stamp, subs, tree) {

// }
// // -------------------------
// var tree = subscribe(state, app.$map(), listen)

// // -------------------------
// document.body.appendChild(appelem)
// -------------------------
console.timeEnd('START')
global.state = state
console.log('TREE', tree)
