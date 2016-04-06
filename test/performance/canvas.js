'use strict'
var subscribe = require('../../subscribe')
var s = require('../../s')

var state = s({ something: {} })
var subs = { something: {} }
var amount = 10000

for (var i = 0; i < amount; i++) {
  subs.something[i] = { val: true }
}
var cnt = 0

// ---- fix this first -----
var x = {}
for (var i = 0; i < amount; i++) { x[i] = i }
state.something.set(x)
// -------------------------

var Stats = require('stats-js')
var stats = new Stats()
stats.setMode(0)
stats.domElement.style.position = 'absolute'
stats.domElement.style.left = '0px'
stats.domElement.style.top = '0px'
document.body.appendChild(stats.domElement)
var cntx = 0
var cntxx = document.createElement('div')
cntxx.style.border = '1px solid red'
var canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 1000
canvas.height = 1000
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')
var dir = 3
var o = dir
cntx = 0
var color = 'rgba(0, 0, 0, 0.1)'
function goCanvas () {
  stats.begin()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  cntx += dir
  if (cntx > 1000) {
    dir = -1 * o
  } else if (cntx < 1) {
    dir = o
  }
  for (var i = 0; i < amount; i++) {
    x[i] = i + cntx
  }
  state.something.set(x)
  stats.end()
  window.requestAnimationFrame(goCanvas)
}

// need fps meter
var tree = subscribe(state, subs, function (type) {
  var x = Math.sin(this.val / 5 + cntx / 40) * 300 + 400 + this.key * 0.01 + Math.cos(this.val + cntx / (40 - this.key / 1000)) * 10
  var y = Math.cos(this.val / 10) * 300 + this.key * 0.01 + 400 + Math.sin(this.val + cntx/(40 - this.key / 1000)) * 10
  ctx.fillStyle = color
  ctx.fillRect( x, y, 3, 3)
})
goCanvas()
console.log(tree)
