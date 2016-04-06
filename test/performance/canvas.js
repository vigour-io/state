'use strict'
var subscribe = require('../../subscribe')
var s = require('../../s')
var state = s({ something: {} })
var subs = { something: {} }
var amount = 1e4
// -------------------------
for (var i = 0; i < amount; i++) {
  subs.something[i] = { val: true }
}
// -------------------------
var Stats = require('stats-js')
var stats = new Stats()
stats.setMode(0)
document.body.appendChild(stats.domElement)
// -------------------------
var cnt = 0
var canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 1000
canvas.height = 1000
document.body.appendChild(canvas)
var context = canvas.getContext('2d')
var dir = 3
var o = dir
context.fillStyle = 'rgba(0, 0, 0, 0.1)'
// -------------------------
function goCanvas () {
  stats.begin()
  context.clearRect(0, 0, canvas.width, canvas.height)
  cnt += dir
  if (cnt > 1000) {
    dir = -1 * o
  } else if (cnt < 1) {
    dir = o
  }
  var x = {}
  for (var i = 0; i < amount; i++) {
    x[i] = i + cnt
  }
  state.something.set(x)
  stats.end()
  window.requestAnimationFrame(goCanvas)
}
// -------------------------
var tree = subscribe(state, subs, function (type) {
  // console.log('FIRE FIRE FIRE!', type, this)
  var val = this.val
  var i = this.key
  var x = Math.sin(val / 5 + cnt / 40) * 300 + 400 +
    i * 0.01 + Math.cos(val + cnt / (40 - i / 1000)) * 10
  var y = Math.cos(val / 10) * 300 +
    i * 0.01 + 400 + Math.sin(val + cnt / (40 - i / 1000)) * 10
  context.fillRect(x, y, 3, 3)
})
// -------------------------
console.log('TREE', tree)
console.log('START ' + amount)
goCanvas()
