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

  it('takes dataKey config option', () => {
    expect(
      snapshotDiff(
        transformFixture(__dirname, {}, 'test-classname-to-data-test.js'),
        transformFixture(
          __dirname,
          {
            'data-key': 'data-cypress'
          },
          'test-classname-to-data-test.js'
        )
      )
    ).toMatchSnapshot();
  });

  it('transforms classes wrapped in classNames/cx', () => {
    expect(
      transformFixture(__dirname, {}, 'test-classnames-library.js')
    ).toMatchSnapshot();
  });

  it('does not transform classes wrapped in template literal (yet)', () => {
    expect(transformFixture(__dirname, {}, 'test-template-literals.js')).toBe(
      null
    );
  });
});
