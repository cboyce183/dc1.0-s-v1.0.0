const esprima = require('esprima')
const map = require('./map');

module.exports = (codeInput) => {
  try {
    const parsedCode = esprima.parseScript(codeInput).body;
    if (parsedCode.length) return parsedCode.map(el => map.get(el.type)(el)).join('\n');
    else return 'Tienes que escribir algo, criatura parte de nuestro plano de existencia!';
  } catch(err) {
    return err.description;
  }
};