'use strict'
const diff = require('./diff')
const dictionary = require('./dictionary')
const DONE = dictionary.DONE
const INIT = dictionary.INIT
const UPDATE = dictionary.UPDATE

exports.update = function update (target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs && subs.val === true) {
    update(target, UPDATE, stamp, subs, tree)
  }
  diff(travelTarget, subs, update, tree, stamp)
  if ('done' in subs) {
    update(target, UPDATE, stamp, subs, tree, DONE)
  }
}

exports.create = function create (target, travelTarget, subs, update, tree, stamp) {
  if ('val' in subs) {
    update(target, INIT, stamp, subs, tree)
  }
  diff(travelTarget, subs, update, tree, stamp)
  if ('done' in subs) {
    update(target, INIT, stamp, subs, tree, DONE)
  }
}
