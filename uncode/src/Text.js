import React, { Component } from 'react';

import './App.css';

class Text extends Component {

  constructor(props) {
    super(props);
    this.lines = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]
  }

  convertKeys ( event ) {
    console.log(this.text.selectionStart)
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = this.text.selectionStart;
      const end = this.text.selectionEnd;
      this.text.value = this.text.value.slice(0, start) + '  ' + this.text.value.slice(start);
      this.text.selectionStart = start + 2;
      this.text.selectionEnd = end + 2;
    } else if (event.key === '{') {
      event.preventDefault();
      const start = this.text.selectionStart;
      const end = this.text.selectionEnd;
      this.text.value = `${this.text.value.slice(0, start)}{

}${this.text.value.slice(start)}`;
      this.text.selectionStart = start + 2;
      this.text.selectionEnd = end + 2;
    } else if (event.key === '[') {
      event.preventDefault();
      const start = this.text.selectionStart;
      const end = this.text.selectionEnd;
      this.text.value = this.text.value.slice(0, start) + '[]' + this.text.value.slice(start);
      this.text.selectionStart = start + 1;
      this.text.selectionEnd = end + 1;
    } else if (event.key === '(') {
      event.preventDefault();
      const start = this.text.selectionStart;
      const end = this.text.selectionEnd;
      this.text.value = this.text.value.slice(0, start) + '()' + this.text.value.slice(start);
      this.text.selectionStart = start + 1;
      this.text.selectionEnd = end + 1;
    }
  }

  //=============================================== REDERING

  renderLineNumbers () {
    return (<textarea readOnly className="LineNumbers">{this.lines.map(el => (('0'+el).slice(-2))+'|').join('\n')}</textarea>)
  }

  render() {
    const lineNumbers = this.renderLineNumbers();
    return (
      <div className="Editor">
        {lineNumbers}
        <textarea
          ref={el => this.text = el}
          onChange={() => this.props.func(this.text.value)}
          onKeyDown={(e) => this.convertKeys(e)}
          className="Text"
          placeholder={this.props.placeholder}/>
      </div>
    );
  }
}

export default Text;
