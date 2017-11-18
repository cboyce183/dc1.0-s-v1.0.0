const map = new Map();
const tab = '  '; //Definition of tabs for the text

map.set('Literal', (object) => object.value);

map.set('Identifier', (object) => object.name);

//Missing a better string explaining function of this keyword
map.set('ThisExpression', (object) => 'this');

map.set('ExpressionStatement', (object) =>
  map.get(object.expression.type)(object.expression));

map.set('VariableDeclaration', (object) => {
  const declarations = object.declarations;
  const joinedText = declarations.map(dec => map.get(dec.type)(dec)).join(' and ');
  const variableText = declarations.length > 1
                       ? ` variables: ${declarations.map(dec => dec.id.name).join(', ')};`
                       : ' variable';
  return `${object.declarations.length} ${object.kind}${variableText} ${joinedText}`
})
map.set('VariableDeclarator', (object) =>
  `${map.get(object.id.type)(object.id)} is assigned to ${map.get(object.init.type)(object.init)}`);

map.set('IfStatement', (object, statement = 'if') => {
  let alternate = undefined;
  if (object.alternate) {
    alternate = object.alternate.type === 'IfStatement'
        ? map.get(object.alternate.type)(object.alternate, 'else if')
        : 'else, in the case none of the previous conditions are met:\n' + tab + map.get(object.alternate.type)(object.alternate);
  }
  return `${statement} ${map.get(object.test.type)(object.test)} resolves to true, executes:
  ${map.get(object.consequent.type)(object.consequent)} ${(object.alternate) ? alternate : ''}`;
})

map.set('ForStatement', (object) => {
  let init = map.get(object.init.type)(object.init);
  let condition = map.get(object.test.type)(object.test);
  let update = map.get(object.update.type)(object.update);
  let doThing = map.get(object.body.type)(object.body);
  return init + `; while ` + condition + ` is true,\n\t  ` + doThing + `\t\t` + update;
  }
)



map.set('ConditionalExpression', (object) =>
  `Ternary expression which checks if ${map.get(object.test.type)(object.test)}
   is true: if it is, it returns ${map.get(object.consequent.type)(object.consequent)},
   otherwise: it returns ${map.get(object.alternate.type)(object.alternate)}`);

map.set('LogicalExpression', (object) =>
  object.operator === '&&'
  ? `boolean of ${map.get(object.left.type)(object.left)} AND ${map.get(object.right.type)(object.right)}`
  : `boolean of ${map.get(object.left.type)(object.left)} OR ${map.get(object.right.type)(object.right)}`);

map.set('FunctionExpression', (object) =>
  `a function${
    object.params.length ? ' that takes ' + object.params.map(param => map.get(param.type)(param)).join(', ') + ' as arguments' : ''
  }, which when called:
  ${map.get(object.body.type)(object.body)}`);

map.set('FunctionDeclaration', (object) =>
  `Declaration of a function named ${map.get(object.id.type)(object.id)} that takes
   ${object.params.map(param => map.get(param.type)(param)).join(', ')} as arguments, which when called:
  ${map.get(object.body.type)(object.body)}`);

map.set('BlockStatement', (object) =>
  `${object.body.map(line => tab + map.get(line.type)(line) + '\n').join(tab)}`);

map.set('ArrowFunctionExpression', (object) => {
  if (!object.body.body) {
    return `an arrow function that takes ${object.params.map(param => map.get(param.type)(param)).join(', ')} as arguments, which when called returns ${map.get(object.body.type)(object.body)}`
  }
  return `an arrow function that takes ${object.params.map(param => map.get(param.type)(param)).join(', ')} as arguments, which when called
  ${tab}${object.body.body.map(line => map.get(line.type)(line)).join('\n')}`
});

map.set('ReturnStatement', (object) => `returns ${map.get(object.argument.type)(object.argument)}`);

map.set('ArrayExpression', (object) => {
  const foo = object.elements.length > 0
      ? `containing ${object.elements.map(el => map.get(el.type)(el)). join(' and ')}`
      :'';
  return `an array of ${object.elements.length} elements ` +  foo;
  }
);

map.set('ObjectExpression', (object) =>
  `an object of key:value pairs of ${object.properties.map(el =>
    `${map.get(el.key.type)(el.key)}:${map.get(el.value.type)(el.value)}`).join(', ')
  }`);

map.set('ClassDeclaration', (object) =>
  `declaration of a class named ${map.get(object.id.type)(object.id)} ${map.get(object.body.type)(object.body)}`);

map.set('ClassBody', (object) =>
  `containing ${object.body.length} method(s): \n  ${object.body.map(method => map.get(method.type)(method)).join(tab + 'and ')}`);

map.set('MethodDefinition', (object) => {
  if (object.kind === 'constructor') {
    return `a constructor which is ${map.get(object.value.type)(object.value)}`
  }
  return `a method named ${map.get(object.key.type)(object.key)} which is ${map.get(object.value.type)(object.value)}`
});

map.set('MemberExpression', (object) =>
        `property ${map.get(object.property.type)(object.property)} of ${map.get(object.object.type)(object.object)}`);

map.set('UpdateExpression', (object) =>
  object.operator === '++'
    ? `${map.get(object.argument.type)(object.argument)} increased by 1`
    : `${map.get(object.argument.type)(object.argument)} decreased by 1`
);

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

map.set('BinaryExpression', (object) => {
  let operatorText;
  switch(object.operator) {
    case '+':
      return `${map.get(object.left.type)(object.left)} plus ${map.get(object.right.type)(object.right)}`
    case '-':
      return `${map.get(object.left.type)(object.left)} minus ${map.get(object.right.type)(object.right)}`
    case '*':
      return `${map.get(object.left.type)(object.left)} times ${map.get(object.right.type)(object.right)}`
    case '**':
      return `${map.get(object.left.type)(object.left)} to the power of ${map.get(object.right.type)(object.right)}`
    case '/':
      return `${map.get(object.left.type)(object.left)} divided by ${map.get(object.right.type)(object.right)}`
    case '&':
      return `the bitwise AND operation of ${map.get(object.left.type)(object.left)} and ${map.get(object.right.type)(object.right)}`;
    case '|':
      return `the bitwise OR operation of ${map.get(object.left.type)(object.left)} and ${map.get(object.right.type)(object.right)}`;
    case '^':
      return `the bitwise XOR operation of ${map.get(object.left.type)(object.left)} and ${map.get(object.right.type)(object.right)}`;
    case '<<':
      return `the binary representation of ${map.get(object.left.type)(object.left)} shifted ${map.get(object.right.type)(object.right)} bits to the left`;
    case '>>':
      return `the binary representation of ${map.get(object.left.type)(object.left)} shifted ${map.get(object.right.type)(object.right)} bits to the right`;
    case '>>>':
      return `the binary representation of ${map.get(object.left.type)(object.left)} zero-fill-right shifted ${map.get(object.right.type)(object.right)}`;
    case '<':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is less than ${map.get(object.right.type)(object.right)})`;
    case '<=':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is less than or equal to ${map.get(object.right.type)(object.right)})`;
    case '>':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is greater than ${map.get(object.right.type)(object.right)})`;
    case '>=':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is greater than or equal to ${map.get(object.right.type)(object.right)})`;
    case '!=':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is not equal to ${map.get(object.right.type)(object.right)})`;
    case '!==':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is not deeply equal to ${map.get(object.right.type)(object.right)})`;
    case '==':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is equal to ${map.get(object.right.type)(object.right)})`;
    case '===':
      return `the boolean value of (${map.get(object.left.type)(object.left)} is deeply equal to ${map.get(object.right.type)(object.right)})`;
    case 'instanceof':
      return `the boolean value of if (${map.get(object.left.type)(object.left)} is constructed from the prototype of ${map.get(object.right.type)(object.right)})`;
    case '%':
      return `the remainder of ${map.get(object.left.type)(object.left)} divided by ${map.get(object.right.type)(object.right)}`;
  }
});

map.set('AssignmentExpression', (object) => {
  let operatorText;
  switch(object.operator) {
    case '=':
      operatorText = '';
      break;
    case '+=':
      operatorText = 'itself plus ';
      break;
    case '-=':
      operatorText = 'itself minus ';
      break;
    case '*=':
      operatorText = 'itself times ';
      break;
    case '**=':
      operatorText = 'itself to the power of ';
      break;
    case '/=':
      operatorText = 'itself divided by ';
      break;
    case '%=':
      operatorText = 'the remainder of dividing itself by ';
      break;
    case '<<=':
      operatorText = 'itself bitwise left shifted by ';
      break;
    case '>>=':
      operatorText = 'itself bitwise right shifted by ';
      break;
    case '>>>=':
      operatorText = 'itself zero-fill bitwise right shifted by ';
      break;
    case '&=':
      operatorText = 'the bitwise AND of itself and ';
      break;
    case '^=':
      operatorText = 'the bitwise XOR of itself and ';
      break;
    case '|=':
      operatorText = 'the bitwise OR of itself and ';
      break;
  }
  return `${map.get(object.left.type)(object.left)} is assigned to ${operatorText}${map.get(object.right.type)(object.right)}`
});

module.exports = map;