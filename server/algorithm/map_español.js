const map = new Map();
const tab = '  '; //Definition of tabs for the text

map.set('Literal', (object) => object.value);

map.set('Identifier', (object) => object.name);

//Missing a better string explaining function of this keyword
map.set('ThisExpression', (object) => 'esto');

map.set('ExpressionStatement', (object) =>
  map.get(object.expression.type)(object.expression));

map.set('VariableDeclaration', (object) => {
  const declarations = object.declarations;
  const joinedText = declarations.map(dec => map.get(dec.type)(dec)).join(' y ');
  const variableText = declarations.length > 1
                       ? ` variables: ${declarations.map(dec => dec.id.name).join(', ')};`
                       : ' variable';
  return `${object.declarations.length} ${object.kind}${variableText} ${joinedText}`
})
map.set('VariableDeclarator', (object) =>
  `${map.get(object.id.type)(object.id)} es asignado(a) a ${map.get(object.init.type)(object.init)}`);

map.set('ConditionalExpression', (object) =>
  `Expresion ternaria que revisa si ${map.get(object.test.type)(object.test)}
   es verdadero: si lo es, devuelve ${map.get(object.consequent.type)(object.consequent)},
   de otra forma: devuelve ${map.get(object.alternate.type)(object.alternate)}`);

map.set('LogicalExpression', (object) =>
  object.operator === '&&'
  ? `valor booleano de ${map.get(object.left.type)(object.left)} Y ${map.get(object.right.type)(object.right)}`
  : `valor booleano de ${map.get(object.left.type)(object.left)} O ${map.get(object.right.type)(object.right)}`);

map.set('FunctionExpression', (object) =>
  `Una función${
    object.params.length ? ' que toma ' + object.params.map(param => map.get(param.type)(param)).join(', ') + ' como argumentos' : ''
  }, que cuando es invocada:
  ${map.get(object.body.type)(object.body)}`);

map.set('FunctionDeclaration', (object) =>
  `Declaración de una función llamada ${map.get(object.id.type)(object.id)} que toma
   ${object.params.map(param => map.get(param.type)(param)).join(', ')} como argumentos, que cuando es invocada:
  ${map.get(object.body.type)(object.body)}`);

map.set('BlockStatement', (object) =>
  `${object.body.map(line => tab + map.get(line.type)(line) + '\n').join(tab)}`);

map.set('ArrowFunctionExpression', (object) => {
  if (!object.body.body) {
    return `una función flecha que toma ${object.params.map(param => map.get(param.type)(param)).join(', ')} como argumentos, que cuando es invocada devuelve ${map.get(object.body.type)(object.body)}`
  }
  return `una función flecha que toma ${object.params.map(param => map.get(param.type)(param)).join(', ')} como argumentos, que cuando es invocada
  ${tab}${object.body.body.map(line => map.get(line.type)(line)).join('\n')}`
});

map.set('ReturnStatement', (object) => `devuelve ${map.get(object.argument.type)(object.argument)}`);

map.set('ArrayExpression', (object) => {
  const foo = object.elements.length > 0
      ? `que contiene ${object.elements.map(el => map.get(el.type)(el)). join(' y ')}`
      :'';
  return `un array de ${object.elements.length} elementos ` +  foo;
  }
);

map.set('ObjectExpression', (object) =>
  `un objecto de parejas clave:valor de ${object.properties.map(el =>
    `${map.get(el.key.type)(el.key)}:${map.get(el.value.type)(el.value)}`).join(', ')
  }`);

map.set('ClassDeclaration', (object) =>
  `declaración de una clase llamada ${map.get(object.id.type)(object.id)} ${map.get(object.body.type)(object.body)}`);

map.set('ClassBody', (object) =>
  `que contiene ${object.body.length} metodo(s): \n  ${object.body.map(method => map.get(method.type)(method)).join(tab + 'y ')}`);

map.set('MethodDefinition', (object) => {
  if (object.kind === 'constructor') {
    return `un constructor que es ${map.get(object.value.type)(object.value)}`
  }
  return `un metodo llamado ${map.get(object.key.type)(object.key)} que es ${map.get(object.value.type)(object.value)}`
});

map.set('MemberExpression', (object) =>
        `propiedad ${map.get(object.property.type)(object.property)} de ${map.get(object.object.type)(object.object)}`);

map.set('UpdateExpression', (object) =>
  object.operator === '++'
    ? `${map.get(object.argument.type)(object.argument)} incrementado(a) por 1`
    : `${map.get(object.argument.type)(object.argument)} disminuido(a) por 1`
);

map.set('UnaryExpression', (object) => {
  const argument = object.argument;
  const nextTextValue = map.get(argument.type);
  switch(object.operator) {
    case '!':
      return `lo opuesto al valor booleano de ${nextTextValue(argument)}`;
    case '-':
      return `negativo ${nextTextValue(argument)}`;
    case '+':
      return nextTextValue(argument);
    case '~':
      return `el bitwise opuesto de ${nextTextValue(argument)}`;
    case 'typeof':
      return `el tipo de ${nextTextValue(argument)} en cadena literal`;
    case 'delete':
      return `borra ${nextTextValue(argument)}`;
    case 'void':
      return `nada`;
  }
});

map.set('BinaryExpression', (object) => {
  let operatorText;
  switch(object.operator) {
    case '+':
      return `${map.get(object.left.type)(object.left)} más ${map.get(object.right.type)(object.right)}`
    case '-':
      return `${map.get(object.left.type)(object.left)} menos ${map.get(object.right.type)(object.right)}`
    case '*':
      return `${map.get(object.left.type)(object.left)} por ${map.get(object.right.type)(object.right)}`
    case '**':
      return `${map.get(object.left.type)(object.left)} a la potencia de ${map.get(object.right.type)(object.right)}`
    case '/':
      return `${map.get(object.left.type)(object.left)} dividido(a) por ${map.get(object.right.type)(object.right)}`
    case '&':
      return `la operación bitwise Y de ${map.get(object.left.type)(object.left)} y ${map.get(object.right.type)(object.right)}`; 
    case '|':
      return `la operación bitwise O de ${map.get(object.left.type)(object.left)} y ${map.get(object.right.type)(object.right)}`; 
    case '^':
      return `la operación bitwise XOR de ${map.get(object.left.type)(object.left)} y ${map.get(object.right.type)(object.right)}`; 
    case '<<':
      return `la representación binaria de ${map.get(object.left.type)(object.left)} desplazado(a) ${map.get(object.right.type)(object.right)} bits a la izquierda`; 
    case '>>':
      return `la representación binaria de ${map.get(object.left.type)(object.left)} desplazado(a) ${map.get(object.right.type)(object.right)} bits a la derecha`; 
    case '>>>':
      return `la representación binaria de ${map.get(object.left.type)(object.left)} desplazado(a) ${map.get(object.right.type)(object.right)} bits a la derecha y relleno de zeros desde la izquierda`; 
    case '<':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} es menor que ${map.get(object.right.type)(object.right)}`; 
    case '<=':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} es menor o igual que ${map.get(object.right.type)(object.right)}`; 
    case '>':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} es mayor que ${map.get(object.right.type)(object.right)}`; 
    case '>=':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} es mayor o igual que ${map.get(object.right.type)(object.right)}`; 
    case '!=':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} no es igual a ${map.get(object.right.type)(object.right)}`; 
    case '!==':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} no es profundamente igual a ${map.get(object.right.type)(object.right)}`; 
    case '==':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} es igual a ${map.get(object.right.type)(object.right)}`; 
    case '===':
      return `el valor booleano de ${map.get(object.left.type)(object.left)} es profundamente igual a ${map.get(object.right.type)(object.right)}`; 
    case 'instanceof':
      return `el valor booleano de si ${map.get(object.left.type)(object.left)} fue construido(a) del prototipo de ${map.get(object.right.type)(object.right)}`; 
    case '%':
      return `el remanente de ${map.get(object.left.type)(object.left)} dividido(a) por ${map.get(object.right.type)(object.right)}`;
  }
});

map.set('AssignmentExpression', (object) => {
  let operatorText;
  switch(object.operator) {
    case '=':
      operatorText = '';
      break;
    case '+=':
      operatorText = 'sí mismo mas ';
      break;
    case '-=':
      operatorText = 'sí mismo menos ';
      break;
    case '*=':
      operatorText = 'sí mismo por ';
      break;
    case '**=':
      operatorText = 'sí mismo al poder de ';
      break;
    case '/=':
      operatorText = 'sí mismo dividido por ';
      break;
    case '%=':
      operatorText = 'el remanente de la divisioón de sí mismo por ';
      break;
    case '<<=':
      operatorText = 'sí mismo desplazado(a) en bitwise hacia la izquierda por ';
      break;
    case '>>=':
      operatorText = 'sí mismo desplazado(a) en bitwise hacia la derecha por ';
      break;
    case '>>>=':
      operatorText = 'sí mismo relleno de zeros por la izquierda y desplazado(a) en bitwise hacia la derecha por ';
      break;
    case '&=':
      operatorText = 'el bitwise Y de sí mismo y ';
      break;
    case '^=':
      operatorText = 'el bitwise XOR de sí mismo y ';
      break;
    case '|=':
      operatorText = 'el bitwise O de sí mismo y ';
      break;
  }
  return `${map.get(object.left.type)(object.left)} es asignado(a) a ${operatorText}${map.get(object.right.type)(object.right)}`
});

module.exports = map;