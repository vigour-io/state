'use strict'

module.exports = function subscribe (target, obs) {
  if (typeof obs === 'object' && !obs._base_version) {
    for (let uid in obs) {
      subscribe(target, obs[uid])
    }
  } else {
    if (target._) {
      if (target._._base_version) {
        target._ = { [target._.uid()]: target._ }
      }
      target._[obs.uid()] = obs
    } else {
      target._ = obs
    }
  }
}
