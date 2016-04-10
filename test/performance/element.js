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
function goDom () {
  stats.begin()

  stats.end()
  window.requestAnimationFrame(goDom)
}
// -------------------------
function listen (type) {

}
// -------------------------
// make this extra heavy
var tree = subscribe(
  state,
  { something: { $any: true } },
  listen
)
// -------------------------
console.log('TREE', tree)
console.log('START ' + amount)
goDom()
