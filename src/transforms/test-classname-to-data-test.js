// https://astexplorer.net/#/gist/52eda1a17c5ccfaaec1bb28302b5508c/baebc408e8e0cc0d7bba107e7ec4b3e30c97a4cf

const getAttributeWithNameIndex = (attributes, attrName) =>
  attributes.findIndex(
    attr => attr.name && attr.name.name && attr.name.name === attrName
  );

const without = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];

const isExpressionCallingFunc = (path, funcName) => {
  if (
    path.value.expression &&
    path.value.expression.type === 'CallExpression'
  ) {
    const functionName =
      path.value.expression.callee && path.value.expression.callee.name;
    return functionName && functionName === funcName;
  }
  return false;
};

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

    if (classNameAttr) {
      if (classNameAttr.value.type === j.Literal.name) {
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
      } else if (classNameAttr.value.type === j.JSXExpressionContainer.name) {
        if (
          isExpressionCallingFunc(classNameAttr, 'cx') ||
          isExpressionCallingFunc(classNameAttr, 'classNames')
        ) {
          const classNamesArguments = classNameAttr.value.expression.arguments;
          const testClassArgumentIndex = classNamesArguments.findIndex(
            arg =>
              arg.type === j.Literal.name &&
              arg.value.startsWith(classNamePrefix)
          );

          if (testClassArgumentIndex > -1) {
            const testClassName =
              classNamesArguments[testClassArgumentIndex].value;

            if (classNamesArguments.length === 1) {
              openingElement.node.attributes = without(
                attributes,
                classNameAttrIndex
              );
            } else {
              classNameAttr.value.expression.arguments = without(
                classNamesArguments,
                testClassArgumentIndex
              );
            }

            openingElement.node.attributes.push(
              j.jsxAttribute(
                j.jsxIdentifier(dataKey),
                j.stringLiteral(testClassName.slice(classNamePrefix.length))
              )
            );
            hasModifications = true;
          }
        } else if (
          classNameAttr.value.expression &&
          classNameAttr.value.expression.type === 'TemplateLiteral'
        ) {
          const stringListInTemplate = classNameAttr.value.expression.quasis;
          const testClassIndex = stringListInTemplate.findIndex(
            templateElement =>
              templateElement.value.cooked.trim().startsWith(classNamePrefix)
          );

          if (testClassIndex > -1) {
            const testClassName = stringListInTemplate[
              testClassIndex
            ].value.cooked.trim();

            if (stringListInTemplate.length === 1) {
              openingElement.node.attributes = without(
                attributes,
                classNameAttrIndex
              );
            } else {
              stringListInTemplate[testClassIndex].value = {
                cooked: '',
                raw: ''
              };
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
      }
    }
  });

  return hasModifications ? root.toSource({ quotes: 'single' }) : null;
};
