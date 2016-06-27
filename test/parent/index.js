'use strict'
require('./basic')('$parent')
require('./switch')('$parent')
require('./references')('$parent')

require('./basic')('parent')
require('./switch')('parent')
require('./references')('parent')

// run them twice one for $parent one for parent
