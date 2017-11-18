const map = new Map();
const tab = '  '; //Definition of tabs for the text

map.set('Literal', (object) => object.value);

map.set('Identifier', (object) => object.name);

//Missing a better string explaining function of this keyword
map.set('ThisExpression', (object) => 'questo(a)');

map.set('ExpressionStatement', (object) =>
  map.get(object.expression.type)(object.expression));

map.set('VariableDeclaration', (object) => {
  const declarations = object.declarations;
  const joinedText = declarations.map(dec => map.get(dec.type)(dec)).join(' y ');
  const variableText = declarations.length > 1
                       ? ` variabili: ${declarations.map(dec => dec.id.name).join(', ')};`
                       : ' variable';
  return `${object.declarations.length} ${object.kind}${variableText} ${joinedText}`
})
map.set('VariableDeclarator', (object) =>
  `${map.get(object.id.type)(object.id)} è assegnata(o) a ${map.get(object.init.type)(object.init)}`);

map.set('ConditionalExpression', (object) =>
  `Espressione ternaria che recensioni se ${map.get(object.test.type)(object.test)}
   è vero: se lo è, ritorna ${map.get(object.consequent.type)(object.consequent)},
   altrimenti: ritorna ${map.get(object.alternate.type)(object.alternate)}`);

map.set('LogicalExpression', (object) =>
  object.operator === '&&'
  ? `Valore booleano di ${map.get(object.left.type)(object.left)} E ${map.get(object.right.type)(object.right)}`
  : `Valore booleano di ${map.get(object.left.type)(object.left)} O ${map.get(object.right.type)(object.right)}`);

map.set('FunctionExpression', (object) =>
  `Una funzione${
    object.params.length ? ' che prende ' + object.params.map(param => map.get(param.type)(param)).join(', ') + ' come argomenti' : ''
  }, che quando è invocata:
  ${map.get(object.body.type)(object.body)}`);

map.set('FunctionDeclaration', (object) =>
  `Dichiarazione di una funzione chiamata ${map.get(object.id.type)(object.id)} che prende
   ${object.params.map(param => map.get(param.type)(param)).join(', ')} come argomenti, che quando è invocata:
  ${map.get(object.body.type)(object.body)}`);

map.set('BlockStatement', (object) =>
  `${object.body.map(line => tab + map.get(line.type)(line) + '\n').join(tab)}`);

map.set('ArrowFunctionExpression', (object) => {
  if (!object.body.body) {
    return `una funzioni a freccia che prende ${object.params.map(param => map.get(param.type)(param)).join(', ')} come argomenti, che quando è invocata ritorna ${map.get(object.body.type)(object.body)}`
  }
  return `una funzioni a freccia che prende ${object.params.map(param => map.get(param.type)(param)).join(', ')} come argomenti, che quando è invocata
  ${tab}${object.body.body.map(line => map.get(line.type)(line)).join('\n')}`
});

map.set('ReturnStatement', (object) => `ritorna ${map.get(object.argument.type)(object.argument)}`);

map.set('ArrayExpression', (object) => {
  const foo = object.elements.length > 0
      ? `che contiene ${object.elements.map(el => map.get(el.type)(el)). join(' e ')}`
      :'';
  return `un array di ${object.elements.length} elementi ` +  foo;
  }
);

map.set('ObjectExpression', (object) =>
  `un oggetto di coppie chiave:valore di ${object.properties.map(el =>
    `${map.get(el.key.type)(el.key)}:${map.get(el.value.type)(el.value)}`).join(', ')
  }`);
/////////////
map.set('ClassDeclaration', (object) =>
  `dichiarazzione di una classe chiamata ${map.get(object.id.type)(object.id)} ${map.get(object.body.type)(object.body)}`);

map.set('ClassBody', (object) =>
  `che contiene ${object.body.length} metodo(i): \n  ${object.body.map(method => map.get(method.type)(method)).join(tab + 'e ')}`);

map.set('MethodDefinition', (object) => {
  if (object.kind === 'constructor') {
    return `un costruttore che è ${map.get(object.value.type)(object.value)}`
  }
  return `un metodo chiamato ${map.get(object.key.type)(object.key)} che è ${map.get(object.value.type)(object.value)}`
});

map.set('MemberExpression', (object) =>
        `propietà ${map.get(object.property.type)(object.property)} di ${map.get(object.object.type)(object.object)}`);

map.set('UpdateExpression', (object) =>
  object.operator === '++'
    ? `${map.get(object.argument.type)(object.argument)} incrementato(a) di 1`
    : `${map.get(object.argument.type)(object.argument)} diminuito(a) di 1`
);

map.set('UnaryExpression', (object) => {
  const argument = object.argument;
  const nextTextValue = map.get(argument.type);
  switch(object.operator) {
    case '!':
      return `l'opposto del valore booleano di ${nextTextValue(argument)}`;
    case '-':
      return `negativo ${nextTextValue(argument)}`;
    case '+':
      return nextTextValue(argument);
    case '~':
      return `il bitwise opposto di ${nextTextValue(argument)}`;
    case 'typeof':
      return `il tipo di ${nextTextValue(argument)} come Stringa`;
    case 'delete':
      return `cancela ${nextTextValue(argument)}`;
    case 'void':
      return `niente`;
  }
});

map.set('BinaryExpression', (object) => {
  let operatorText;
  switch(object.operator) {
    case '+':
      return `${map.get(object.left.type)(object.left)} piú ${map.get(object.right.type)(object.right)}`
    case '-':
      return `${map.get(object.left.type)(object.left)} meno ${map.get(object.right.type)(object.right)}`
    case '*':
      return `${map.get(object.left.type)(object.left)} per ${map.get(object.right.type)(object.right)}`
    case '**':
      return `${map.get(object.left.type)(object.left)} alla potenza di ${map.get(object.right.type)(object.right)}`
    case '/':
      return `${map.get(object.left.type)(object.left)} diviso per ${map.get(object.right.type)(object.right)}`
    case '&':
      return `la operazione bitwise E di ${map.get(object.left.type)(object.left)} e ${map.get(object.right.type)(object.right)}`; 
    case '|':
      return `la operazione bitwise O di ${map.get(object.left.type)(object.left)} e ${map.get(object.right.type)(object.right)}`; 
    case '^':
      return `la operazione bitwise XOR di ${map.get(object.left.type)(object.left)} e ${map.get(object.right.type)(object.right)}`; 
    case '<<':
      return `la rappresentazione binaria di ${map.get(object.left.type)(object.left)} spostato(a) ${map.get(object.right.type)(object.right)} bits a la izquierda`; 
    case '>>':
      return `la rappresentazione binaria di ${map.get(object.left.type)(object.left)} spostato(a) ${map.get(object.right.type)(object.right)} bits a la derecha`; 
    case '>>>':
      return `la rappresentazione binaria di ${map.get(object.left.type)(object.left)} spostato(a) ${map.get(object.right.type)(object.right)} bits a la derecha y relleno de zeros desde la izquierda`; 
    case '<':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} è minore di ${map.get(object.right.type)(object.right)}`; 
    case '<=':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} è minore o uguale di ${map.get(object.right.type)(object.right)}`; 
    case '>':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} è maggiore di ${map.get(object.right.type)(object.right)}`; 
    case '>=':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} è maggiore o uguale di ${map.get(object.right.type)(object.right)}`; 
    case '!=':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} non è uguale a ${map.get(object.right.type)(object.right)}`; 
    case '!==':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} non è profondamente uguale a ${map.get(object.right.type)(object.right)}`; 
    case '==':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} è uguale a ${map.get(object.right.type)(object.right)}`; 
    case '===':
      return `il valore booleano di ${map.get(object.left.type)(object.left)} è profondamente uguale a ${map.get(object.right.type)(object.right)}`; 
    case 'instanceof':
      return `il valore booleano di se ${map.get(object.left.type)(object.left)} è stato(a) costruito(a) dal prototipo di ${map.get(object.right.type)(object.right)}`; 
    case '%':
      return `il remanente di ${map.get(object.left.type)(object.left)} diviso(a) per ${map.get(object.right.type)(object.right)}`;
  }
});

map.set('AssignmentExpression', (object) => {
  let operatorText;
  switch(object.operator) {
    case '=':
      operatorText = '';
      break;
    case '+=':
      operatorText = 'se stesso(a) piú ';
      break;
    case '-=':
      operatorText = 'se stesso(a) meno ';
      break;
    case '*=':
      operatorText = 'se stesso(a) per ';
      break;
    case '**=':
      operatorText = 'se stesso(a) alla potenza di ';
      break;
    case '/=':
      operatorText = 'se stesso(a) diviso per ';
      break;
    case '%=':
      operatorText = 'il rimanente della divisione di se stesso(a) per ';
      break;
    case '<<=':
      operatorText = 'se stesso(a) spostato(a) in bitwise alla sinistra per ';
      break;
    case '>>=':
      operatorText = 'se stesso(a) spostato(a) in bitwise alla destra per ';
      break;
    case '>>>=':
      operatorText = 'se stesso(a) riempito(a) di zeri alla sinistra e spostato(a) in bitwise alla destra per ';
      break;
    case '&=':
      operatorText = 'il bitwise E di se stesso(a) e ';
      break;
    case '^=':
      operatorText = 'il bitwise XOR di se stesso(a) e ';
      break;
    case '|=':
      operatorText = 'il bitwise O di se stesso(a) e ';
      break;
  }
  return `${map.get(object.left.type)(object.left)} è assegnato(a) a ${operatorText}${map.get(object.right.type)(object.right)}`
});

module.exports = map;