'use strict'

exports.define = {
  render (parent, state, tree, type) {
    // // add type!
    // let elem
    // if (!state && !this.$) {
    //   // console.log('no - state - no subs', this.path())
    //   elem = tree ? createTreeElem(this, parent, tree) : createElem(this, parent)
    //   this.each((p) => {
    //     p.render && p.render(elem, state)
    //   })
    // } else if (state) {
    //   // console.log('????', tree)
    //   elem = createTreeElem(this, parent, tree)
    //   this.each((p) => {
    //     // console.log('yo go!', p.inspect(), p.key)
    //     if (!p.$) {
    //       // totally wrong ofcourse -- really really annoying!
    //       // --- UGGGH
    //       // next to _node store something like _fieldname as well somethign like this else it will never work
    //       // then we can also just do this for everythign
    //       // _: { } // this will fix it completely
    //       // first state in tree _: {} // all keys beng fixed -- also better then storing it on the elem
    //       // better for clases etc
    //       // so these guys need to be stored (somewhere)
    //       // pretty annoying...
    //       // also how do you know that it ends -- you know youre in a tree but it can have a nested subs
    //       // pretty fucked how to do...
    //       // tree? no not there yet...
    //       p.render && p.render(elem, void 0, tree)
    //     }
    //   })
    //   // console.log('state full', this.path())
    // }
    // return elem
  }
}

// function createElem (obs, parent) {
//   const elem = obs._node = document.createElement('div')
//   if (obs.key) { elem.className = obs.key }
//   if (parent) {
//     parent.appendChild(elem)
//   }
//   return elem
// }

// function createTreeElem (obs, parent, tree) {
//   // console.log('?????')
//   const elem = tree._node = document.createElement('div')
//   if (obs.key) { elem.className = obs.key }
//   if (parent) {
//     parent.appendChild(elem)
//   }
//   return elem
// }

// maybe just call ti render and just deal with it in one way yes best
