# react-class-to-data-attr codemod

## Problem

Your codebase uses certain classes for something other than styling, and you want to move them out of `className` and into a data-attribute to prevent mixing the two. A common use case is for having selectors used only for testing.

## Solution

Run something like the following to automate moving those classes to a data-attribute. As a bonus, it removes the prefix you previously needed to differentiate it from styling classes.

`jscodeshift -t react-class-to-data-attr.js <path-to-transform>`

## Examples

Below inputs are JSX elements within a React component, and the outputs are the result of running the script.

```js
// input
<button className="test-add-button">Add</button>
// transformed output
<button data-test="add-button">Add</button>

// input
<button className="btn test-add-button btn-primary">Add</button>
// transformed output
<button className="btn btn-primary" data-test="add-button">Add</button>

// input
<button className={`btn btn-${theme} test-add-button`}>Add</button>
// transformed output
<button className={`btn btn-${theme}`} data-test="add-button">Add</button>

// input, where the file imports the 'classNames' library
<input className={classNames('test-name-input', {disabled: isDisabled})} />
// transformed output
<input className={classNames({disabled: isDisabled})} data-test="name-input" />
```

See the [config options](#custom-configuration-options) for how to handle custom classname prefixes and data-attribute names.

## Setup

1. `npm install -g jscodeshift`
1. `git clone https://github.com/ZachGawlik/react-class-to-data-attr-codemod`
1. `cd react-class-to-data-attr-codemod/src`
1. `jscodeshift -t react-class-to-data-attr.js <path>`
    * `<path>` represents the file, directory, or glob of files to transform
    * use the `--extensions` option to transform more than just `.js` files, e.g. `--extensions js,jsx`
    * if you use flowtype, you might also need to use `--parser=flow`;
    * append `-d -p` to avoid writing to file and to print the transformed output

## Custom Configuration Options

`--class-name-prefix` sets the filter for what classnames to transform. Defaults to `test-`

`--data-key` sets the name of the data-attribute for transformed classes. Defaults to `test`

For example,

 `jscodeshift -t react-class-to-data-attr.js /src/components --class-name-prefix="spec-" --data-key="cypress"` would transform all .js files in the component directory to use a data-cypress attribute rather than a spec- class prefix.

