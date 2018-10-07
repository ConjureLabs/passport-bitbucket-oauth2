const { test } = require('ava')
const lib = require('../')

test('module should report a version', t => {
  t.is(typeof lib.version, 'string')
  // testing for X.Y.Z
  t.true(/^\d+\.\d+\.\d+$/.test(lib.version))
})
