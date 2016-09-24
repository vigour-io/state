'use strict'
const diff = require('./diff')
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const SWITCH = 'switch'

exports.update = function update (target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs && subs.val === true) {
    update(target, UPDATE, stamp, subs, tree)
  }
  diff(travelTarget, subs, update, tree, stamp)
}

exports.create = function create (target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, INIT, stamp, subs, tree)
  }
  // this is def wrong
  diff(travelTarget, subs, update, tree, stamp)
}

exports.simpleUpdate = function simpleUpdate (target, subs, update, tree, stamp) {
  if ('val' in subs && subs.val === true) {
    update(target, UPDATE, stamp, subs, tree)
  }
}

exports.switchCreate = function switchCreate (target, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, INIT, stamp, subs, tree, SWITCH)
  }
}

exports.switchUpdate = function switchUpdate (target, subs, update, tree, stamp) {
  if ('val' in subs && subs.val === true) {
    update(target, !target || target.val === null ? REMOVE : UPDATE, stamp, subs, tree, SWITCH)
  }
}
