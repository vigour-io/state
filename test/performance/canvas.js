'use strict'
var Stats = require('stats-js')
var stats = new Stats()
stats.setMode(0)
document.body.appendChild(stats.domElement)
// -------------------------
var subscribe = require('../../subscribe')
var s = require('../../s')
var state = s({ something: {} })
var amount = 1e4
// -------------------------
var cnt = 0
var canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 1000
canvas.height = 1000
document.body.appendChild(canvas)
var context = canvas.getContext('2d')
var dir = 2
context.fillStyle = 'rgba(100, 100, 100, 1)'
// -------------------------
function goCanvas () {
  stats.begin()
  context.clearRect(0, 0, canvas.width, canvas.height)
  cnt += dir
  if (cnt > 2500 || cnt < 1) {
    dir = -1 * dir
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
function listen (type) {
  var val = this.compute()
  var i = this.key
  var x =
    Math.sin(val / 5 + cnt / 40) * 300 +
    i * 0.02 + 400 +
    Math.cos(val + cnt / (40 - i / 1000)) * 10
  var y =
    Math.cos(val / 10) * 300 +
    i * 0.02 + 400 +
    Math.sin(val + cnt / (40 - i / 1000)) * 10
  context.fillRect(x, y, 1, 1)
}
// -------------------------
var tree = subscribe(state, { something: { $any: true } }, listen)
// -------------------------
console.log('TREE', tree)
console.log('START ' + amount)
goCanvas()
