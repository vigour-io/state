'use strict'
// order!!!! very important

module.exports = function renderElement (elem) {
  const nostate = elem.noState
  var div
  if (nostate && elem._cachedNode) {
    // may use cachednode for everything is faster
    // this can leak memmory for non-repeating things -- then its a waste
    div = elem._cachedNode.cloneNode(true)
  } else {
    div = document.createElement('div')
    let nostates = elem._noStateElems !== void 0
      ? elem._noStateElems
      : elem.keys('_noStateElems', noStateElement)

    if (elem.key || elem.css) {
      div.className = elem.css || elem.key // not correct yet! is a property
    }
    // --------------------------------
    if (nostates) {
      for (let i in nostates) {
        div.appendChild(renderElement(elem[nostates[i]], true))
      }
    }
    if (nostate) {
      elem._cachedNode = div
    }
  }
  return div
}

function noStateElement (val, key) {
  const target = val[key]
  return target && target.noState && target.type === 'element'
}
