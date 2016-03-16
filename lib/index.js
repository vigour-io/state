'use strict'
var Observable = require('vigour-observable')

module.exports = new Observable({
  inject: require('./inject'),
  Child: 'Constructor'
}).Constructor
