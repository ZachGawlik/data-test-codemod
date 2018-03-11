const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

const TRANSFORM_NAME = 'react-class-to-data-attr.js';

function transformInline(dirName, options, source) {
  const transform = require(path.join(dirName, '..', TRANSFORM_NAME));
  return transform({ source }, { jscodeshift }, options || {});
}

function transformFixture(dirName, options, fixtureName) {
  const inputPath = path.join(dirName, '..', '__testfixtures__', fixtureName);
  const source = fs.readFileSync(inputPath, 'utf8');

  return transformInline(dirName, options, source);
}

module.exports = {
  transformInline,
  transformFixture
};
