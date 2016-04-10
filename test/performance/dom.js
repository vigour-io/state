'use strict'
var Stats = require('stats-js')
var stats = new Stats()
stats.setMode(0)
document.body.appendChild(stats.domElement)
// -------------------------
var subscribe = require('../../subscribe')
var s = require('../../s')
var state = s({ something: {} })
var amount = 10

var Observable = require('vigour-observable')
// -------------------------
var app = new Observable({
  a: {
    b: {
      c: {
        $: { field: true }
      }
    }
  }
})

// -------------------------
function listen (type) {
  console.log('yo yo yo')
}
// -------------------------
// so what we want is a hidden tree??? -- its strange but also makes tons of sense

// make this extra heavy
var tree = subscribe(
  app,
  { something: { $any: true } },
  listen
)
// -------------------------
console.log('TREE', tree)
console.log('START ' + amount)
