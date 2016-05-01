<!-- VDOC.badges travis; standard; npm; coveralls -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
[![Build Status](https://travis-ci.org/vigour-io/state.svg?branch=master)](https://travis-ci.org/vigour-io/state)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-state.svg)](https://badge.fury.io/js/vigour-state)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/state/badge.svg?branch=master&cachebust)](https://coveralls.io/github/vigour-io/state?branch=master)

<!-- VDOC END -->
Fast reactive state management for observables.
Inspired by virtual-dom tree-diffing algorithms

```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
  $any: { title: true }
}, function (type, stamp, subs, tree, parentTree) {
  console.log(type, 'hey an update!', this)
})
// fires an update since we are subscribed to any field with a title
state.set({ a: { title: 'a title' } })
```
