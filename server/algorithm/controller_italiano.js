const esprima = require('esprima')
const map = require('./map');

module.exports = (codeInput) => {
  try {
    const parsedCode = esprima.parseScript(codeInput).body;
    if (parsedCode.length) return parsedCode.map(el => map.get(el.type)(el)).join('\n');
    else return 'Devi scrivere qualcosa, creatura parte del nostro piano di esistenza!';
  } catch(err) {
    return err.description;
  }
};