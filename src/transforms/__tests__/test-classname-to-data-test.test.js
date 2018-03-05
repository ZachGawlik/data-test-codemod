const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const snapshotDiff = require('snapshot-diff');
const { transformFixture } = require('../../testUtils');

// Prevent escaping double-quotes, e.g. className=\\"btn\\"
const rawSerializer = {
  print: val => val,
  test: val => !!val
};
expect.addSnapshotSerializer(rawSerializer);

describe('test-classname-to-data-test', () => {
  it('defaults to transform test-* classnames to data-test attrbutes', () => {
    expect(
      transformFixture(__dirname, {}, 'test-classname-to-data-test.js')
    ).toMatchSnapshot();
  });

  it('takes class-name-prefix config option', () => {
    expect(
      snapshotDiff(
        transformFixture(
          __dirname,
          { 'class-name-prefix': 'spec-' },
          'spec-classname-to-data-test.js'
        ),
        transformFixture(__dirname, {}, 'test-classname-to-data-test.js')
      )
    ).toMatchSnapshot();
  });
});
