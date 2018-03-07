// https://astexplorer.net/#/gist/52eda1a17c5ccfaaec1bb28302b5508c/baebc408e8e0cc0d7bba107e7ec4b3e30c97a4cf

const getAttributeWithNameIndex = (attributes, attrName) =>
  attributes.findIndex(
    attr => attr.name && attr.name.name && attr.name.name === attrName
  );

const without = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];

module.exports = function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const classNamePrefix = options['class-name-prefix'] || 'test-';
  const dataKey = options['data-key'] || 'data-test';
  let hasModifications = false;

  root.find(j.JSXOpeningElement).forEach(openingElement => {
    const attributes = openingElement.node.attributes;

    const classNameAttrIndex = getAttributeWithNameIndex(
      attributes,
      'className'
    );
    const classNameAttr = attributes[classNameAttrIndex];

    if (classNameAttr && classNameAttr.value.type === j.Literal.name) {
      const classNames = classNameAttr.value.value.split(' ');
      const testClassIndex = classNames.findIndex(c =>
        c.startsWith(classNamePrefix)
      );
      if (testClassIndex > -1) {
        const testClassName = classNames[testClassIndex];
        const newClassNames = without(classNames, testClassIndex).join(' ');

        if (newClassNames.trim() === '') {
          openingElement.node.attributes = without(
            attributes,
            classNameAttrIndex
          );
        } else {
          classNameAttr.value = j.stringLiteral(newClassNames);
        }

        openingElement.node.attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier(dataKey),
            j.stringLiteral(testClassName.slice(classNamePrefix.length))
          )
        );
        hasModifications = true;
      }
    }
  });

  return hasModifications ? root.toSource() : null;
};
