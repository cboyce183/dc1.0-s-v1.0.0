const map = new Map();

map.set('VariableDeclaration', (object) => {
  const declarations = object.declarations;
  const joinedText = declarations.map(dec => map.get(dec.type)(dec)).join(' and ');
  const variableText = declarations.length > 1
                       ? ` variables: ${declarations.map(dec => dec.id.name).join(', ')};`
                       : ' variable';
  return `${object.declarations.length} ${object.kind}${variableText} ${joinedText}`
})
map.set('VariableDeclarator', (object) =>
        map.get(object.id.type)(object.id) + ' is assigned to ' +
        map.get(object.init.type)(object.init));

map.set('ExpressionStatement', (object) =>
        map.get(object.expression.type)(object.expression));

map.set('ArrayExpression', (object) =>
        `an array of ${object.elements.length}
        elements containing ${object.elements.map(el => map.get(el.type)(el)). join(' and ')}`);

map.set('ObjectExpression', (object) =>
        `an object of key:value pairs of ${object.properties.map(el =>
          `${map.get(el.key.type)(el.key)}:${map.get(el.value.type)(el.value)}`).join(', ')
        }`);

map.set('Literal', (object) => object.value);
map.set('Identifier', (object) => object.name);

map.set('UnaryExpression', (object) => {
  const argument = object.argument;
  const nextTextValue = map.get(argument.type);
  switch(object.operator) {
    case '!':
      return `the opposite of the boolean of ${nextTextValue(argument)}`;
    case '+':
      return `negative ${nextTextValue(argument)}`;
    case '-':
      return nextTextValue(argument);
    case '~':
      return `the bitwise opposite of ${nextTextValue(argument)}`;
    case 'typeof':
      return `the type of ${nextTextValue(argument)} as a string`;
    case 'delete':
      return `deletes ${nextTextValue(argument)}`;
    case 'void':
      return `nothing`;
  }
});

module.exports = map;