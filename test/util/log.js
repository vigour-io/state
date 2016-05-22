'use strict'
module.exports = function logTree (tree, level, key) {
  console.log(indent(level) + (key ? key + ':' : '') + ' {')
  if (!level) {
    level = 0
  }
  for (let i in tree) {
    if (i !== '_p' && i !== '_key') {
      if (typeof tree[i] === 'object' && !tree[i].isBase) {
        logTree(tree[i], level + 1, i)
      } else {
        console.log(
          indent(level + 1) + (i + ':' || '') + ' ' +
          (tree[i] && tree[i].isBase
            ? 'STATE: ' + tree[i].path().join('/')
            : tree[i]
          )
        )
      }
    }
  }
  console.log(indent(level) + '}')
}
function indent (i) {
  var str = ''
  while (i) {
    i--
    str += '- '
  }
  return str
}
