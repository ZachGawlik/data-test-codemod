// https://astexplorer.net/#/gist/52eda1a17c5ccfaaec1bb28302b5508c/baebc408e8e0cc0d7bba107e7ec4b3e30c97a4cf

const getAttributeWithNameIndex = (attributes, attrName) =>
  attributes.findIndex(
    attr => attr.name && attr.name.name && attr.name.name === attrName
  );

const without = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let hasModifications = false;

  root.find(j.JSXOpeningElement).forEach(openingElement => {
    const attributes = openingElement.node.attributes;

    const classNameAttrIndex = getAttributeWithNameIndex(
      attributes,
      'className'
    );
    const classNameAttr = attributes[classNameAttrIndex];

    if (classNameAttr) {
      const classNames = classNameAttr.value.value.split(' ');
      const testClassIndex = classNames.findIndex(c => c.startsWith('test-'));
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
            j.jsxIdentifier('data-test'),
            j.stringLiteral(testClassName)
          )
        );
        hasModifications = true;
      }
    }
  });

  return hasModifications ? root.toSource() : null;
};
