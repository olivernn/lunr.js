var lunr = require('../lunr.js'),
    assert = require('chai').assert,
    fs = require('fs'),
    path = require('path')

var fixture = function (name) {
  var fixturePath = path.join('test', 'fixtures', name)
  return fs.readFileSync(fixturePath)
}

global.lunr = lunr
global.assert = assert
global.fixture = fixture
