# vigour-state
<!-- VDOC.badges travis; standard; npm; coveralls -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
[![Build Status](https://travis-ci.org/vigour-io/state.svg?branch=master)](https://travis-ci.org/vigour-io/state)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-state.svg)](https://badge.fury.io/js/vigour-state)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/state/badge.svg?branch=master&cachebust)](https://coveralls.io/github/vigour-io/state?branch=master)

<!-- VDOC END -->
Fast reactive state management for observables.
Inspired by virtual-dom tree-diffing algorithms and merkle-trees.

Inherits or extends [vigour-observable](https://github.com/vigour-io/observable)

####simple
```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
  field: { val: true }
}, (state, type) => {
  // type can be "new", "update" or "remove", in this case "new"
  // state is the target of the update, in this case state.field
  console.log(type, state)
})
state.set({ field: 'hello' })
```

####any
```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
  $any: { title: { val: true } }
}, (state, type) => {
  console.log(type, state)
})
// fires an update, subscribed to any field with a title
state.set({ a: { title: 'a title' } })
```

####switch
switch between different subscriptions based on conditions
```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
  field: {
    $switch: {
      exec: (state) => state.key === 'bird' ? 'animal' : 'person',
      animal: {
        class: { val: true },
        diet: { val: true }
      },
      person: {
        name: { val: true },
        job: { val: true }
      }
    }
  }
}, (state, type) => {
  console.log(type, state)
})

state.set({
  bird: {
    class: 'predator',
    diet: 'mice'
  },
  someone: {
    name: 'chris',
    job: 'bird-watcher'
  }
})

// set the field to bird
// this will fire updates for the birds class and diet
state.set({ field: state.bird })

// fires updates
state.bird.class.set('vegetarian')

// will not fire since the bird has no subscription on its job
state.bird.set({ job: 'accountant' })

// set the field to someone
// this will fire updates for the persons name and job
state.set({ field: state.someone })

// will not fire since the person has no subscription on its diet
state.someone.set({ diet: 'paleo' })
```

####root
```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
 field: {
   another: {
     $root: { something: { val: true } }
   }
 }
}, (state, type) => {
  console.log(type, state)
})
// does not fire, since we don't have field.another yet
state.set({ something: true })

// now it does fire
state.set({ field: { another: true } })
```

####self
```javascript
var State = require('vigour-state')
var state = new State({
  a: {
    field: 'bye'
  },
  field: {
    val: '$root.a', // makes a reference to root.a
    field: 'hello'
  }
})
state.subscribe({
  $self: {
    field: {
      field: {
        val: true
      }
    }
  }
}, (state, type) => {
  // fires for non-reference, field.field (hello) instead of a.field
  console.log(type, state)
})

```

####parent
```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
 field: {
   another: {
     $parent: { something: { val: true } }
   }
 }
}, (state, type) => {
  console.log(type, state)
})
// does not fire, since we don't have field.another yet
state.set({ field: { something: true } })

// now it does fire
state.set({ field: { another: true } })
```

####test
```javascript
var State = require('vigour-state')
var state = new State()
state.subscribe({
  movies: {
    $any: {
      $test: {
        exec (state) {
          var query = state.getRoot().query.compute()
          if (query && state.title) {
            return (state.title.compute().indexOf(query) > -1)
          }
        },
        // this is the subscription relevant for the condition
        $: {
          title: {},
          $root: { query: {} }
        },
        // when the condition passes it subscribes to this pattern
        $pass: {
          val: 1, // only fires for remove/create or reference change
          description: { val: true },
          title: { val: true },
          $root: {
            current: { val: true }
          }
        }
      }
    }
  }
}, (state, type) => {
  console.log(type, state)
})

// will fire for interstellar's title and description
state.set({
  query: 'interstellar',
  movies: [
    {
      title: 'jump street',
      description: 'its about streets!'
    },
    {
      title: 'interstellar',
      description: 'its about stars!'
    }
  ]
})

// fires for interstellar (remove) and fires for jump street's title and description
state.query.set('jump')
```
Or any combination of the above

####inject
convert any observable to a state-observable
```javascript
var Observable = require('vigour-observable')
var obs = new Observable({
  inject: require('vigour-state/inject')
})
obs.subscribe({ field: { val: true }}, () => {})
```