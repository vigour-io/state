'use strict'
var test = require('tape')
// var subsTest = require('./test')
var subscribe = require('../subscribe')
var s = require('../s')

var Observable = require('vigour-observable')

test('root subscription', function (t) {
  var state = s({
    something: {
      a: true
      // b: true
    }, // enable c get more depth
    james: true
  })

  var subs = {
    // something: {
    something: {},
    // james: { hello: true },
    // a: {
    //   $root: { james: { hello: true } }
    // }
      // b: {
      //   $root: { james: true },
      //   c: { $root: { james: { hello: true } } }
      // }
    // }
  }

  var amount = 15000

  for (var i = 0; i < amount; i++) {
    // h.set(i)
    subs.something[i] = { val: true }
  }
  console.log(subs)

  var cnt = 0

  // var array = []
  // var h = document.createElement('div')

  // var template = document.createElement('div')
  // template.style.display = 'inline-block'
  // template.style.width = '50px'
  // template.style.height = '50px'
  // template.appendChild(document.createTextNode('text'))

  // for (var i = 0; i < amount; i ++) {
  //   array.push(template.cloneNode(true))
  //   h.appendChild(array[i])
  // }
  // document.body.appendChild(h)
  var x = {}
  for (var i = 0; i < amount; i++) {
    x[i] = i
  }
  state.something.set(x)
  // init does not fire correctly! -- fix it -- strange that it does not fire

  // speed tests
  console.time('1m updates')

  var cntx = 0
  var cntxx = document.createElement('div')
  cntxx.style.border = '1px solid red'

  // function goRender() {
  //   document.body.innerHTML = ''
  //   cntx++
  //   for (var i = 0; i < amount; i++) {
  //     x[i] = i + cntx
  //   }
  //   state.something.set(x)
  //   document.body.appendChild(cntxx)
  //   document.body.appendChild(h)
  //   window.requestAnimationFrame(goRender)
  // }

  // goRender()

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
    window.requestAnimationFrame(goCanvas)
  }
  var tree = subscribe(state, subs, function (type) {
    var x = Math.sin(this.val / 5 + cntx / 40) * 300 + 400 + this.key * 0.01 + Math.cos(this.val + cntx / (40 - this.key / 1000)) * 10
    var y = Math.cos(this.val / 10) * 300 + this.key * 0.01 + 400 + Math.sin(this.val + cntx/(40 - this.key / 1000)) * 10
    ctx.fillStyle = color
    ctx.fillRect( x, y, 3, 3)
  })
  goCanvas()


  // back to 43 ms :D
  // // tree diff is ery fast 400ms for 100k -- totatly within range (for this hard case 3 tracks updating)
  // // do some tests tmrw with dom as well (prelimmenary start!)

  // // ev.trigger()
  // // subs obj is only 70ms! fix obs
  // // get this faster!
  // // var tl = process.hrtime(tt)
  // // will use hrtime for perf tests
  // // console.log(tl)

  // this thing became at least 10 times faster!

  console.timeEnd('1m updates')
  console.log('fired:', cnt)
  // console.log(JSON.stringify(tree, false, 2))
  console.log(state, tree)
  // var a = new Observable({
  //   on: {
  //     data () {

  //     }
  //   }
  // })

  // console.time('10k updates')
  // for (var i = 0; i < amount; i++) {
  //   a.set(i)
  // }
  // console.timeEnd('10k updates')

  // console.time('10k updates')
  // for (var i = 0; i < amount; i++) {
  //   a.set(i)
  // }
  // console.timeEnd('10k updates')

  // diffing is rly good observable is going ultra slow on this!
  // tree at +/- 60ms /10k --- obs 220ms -- not acceptable! -- tree should be heaviest part
  // console.log('#update on nested james field')
  t.end()
})
