const snapshotDiff = require('snapshot-diff');
const { transformFixture } = require('../utils/test-utils');

// Prevent escaping double-quotes, e.g. className=\\"btn\\"
const rawSerializer = {
  print: val => val,
  test: val => !!val
};
expect.addSnapshotSerializer(rawSerializer);

describe('react-class-to-data-attr', () => {
  it('defaults to transform test-* classnames to data-test attrbutes', () => {
    expect(
      transformFixture(__dirname, {}, 'standard-classes.js')
    ).toMatchSnapshot();
  });

  it('takes class-name-prefix config option', () => {
    expect(
      snapshotDiff(
        transformFixture(
          __dirname,
          { 'class-name-prefix': 'spec-' },
          'custom-class-prefix.js'
        ),
        transformFixture(__dirname, {}, 'standard-classes.js')
      )
    ).toMatchSnapshot();
  });

  it('takes dataKey config option', () => {
    expect(
      snapshotDiff(
        transformFixture(__dirname, {}, 'standard-classes.js'),
        transformFixture(
          __dirname,
          {
            'data-key': 'data-cypress'
          },
          'standard-classes.js'
        )
      )
    ).toMatchSnapshot();
  });

  it('transforms classes wrapped in classNames/cx', () => {
    expect(
      transformFixture(__dirname, {}, 'with-classnames-library.js')
    ).toMatchSnapshot();
  });

  it('does not transform classes wrapped in template literal (yet)', () => {
    expect(
      transformFixture(__dirname, {}, 'with-template-literals.js')
    ).toMatchSnapshot();
  });

  it('throws error for element with test classname and existing test-data', () => {
    expect(() =>
      transformFixture(__dirname, {}, 'existing-data-key.js')
    ).toThrowErrorMatchingSnapshot();
  });
});
