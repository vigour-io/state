'use strict'
const diff = require('./diff')
const DONE = 'done'
const INIT = 'new'
const UPDATE = 'update'
const REMOVE = 'remove'
const SWITCH = 'switch'

exports.update = function update (target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs && subs.val === true) {
    update(target, UPDATE, stamp, subs, tree)
  }
  var changed = diff(travelTarget, subs, update, tree, stamp)
  if ('done' in subs) {
    update(target, UPDATE, stamp, subs, tree, DONE)
  }
  return changed
}

exports.create = function create (target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, INIT, stamp, subs, tree)
  }
  var changed = diff(travelTarget, subs, update, tree, stamp)
  if ('done' in subs) {
    update(target, INIT, stamp, subs, tree, DONE)
  }
  return changed
}

exports.remove = function remove (target, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, REMOVE, stamp, subs, tree)
  }
  if ('done' in subs) {
    update(target, REMOVE, stamp, subs, tree, DONE)
  }
}

exports.simpleUpdate = function simpleUpdate (target, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, UPDATE, stamp, subs, tree)
  }
  if ('done' in subs) {
    update(target, UPDATE, stamp, subs, tree, DONE)
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
