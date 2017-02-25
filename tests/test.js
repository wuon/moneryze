'use strict'

const test = require('blue-tape')
const moneris = require('../index')({});

test('empty parameters', t => {
  return t.shouldFail(moneris.send({}), TypeError)
})

test('invalid country code parameters', t => {
  return t.shouldFail(moneris.send({ type: 'purchase' }), TypeError)
});
