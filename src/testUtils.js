const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

const TRANSFORM_NAME = 'test-classname-to-data-test.js';

function runInlineTest(dirName, options, source) {
  const transform = require(path.join(dirName, '..', TRANSFORM_NAME));
  return transform({ source }, { jscodeshift }, options || {});
}

function transformFixture(dirName, options, fixtureName) {
  const inputPath = path.join(dirName, '..', '__testfixtures__', fixtureName);
  const source = fs.readFileSync(inputPath, 'utf8');

  return runInlineTest(dirName, options, source);
}

module.exports = {
  transformFixture
};
