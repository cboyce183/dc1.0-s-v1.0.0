const esprima = require('esprima')
const map = require('./map');

module.exports = (codeInput) => {
  try {
    const parsedCode = esprima.parseScript(codeInput).body;
    if (parsedCode.length) return parsedCode.map(el => map.get(el.type)(el)).join('\n');
    else return 'You have to type something entity manifest upon our plane of existence';
  } catch(err) {
    return err.description;
  }
};