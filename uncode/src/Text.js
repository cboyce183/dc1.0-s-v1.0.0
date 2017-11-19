import React, { Component } from 'react';

import './App.css';

class Text extends Component {

  convertKeys ( event ) {
    const start = this.text.selectionStart;
    const end = this.text.selectionEnd;
    if (event.key === 'Tab') {
      event.preventDefault();
      this.text.value = this.text.value.slice(0, start) + '  ' + this.text.value.slice(start);
      this.text.selectionStart = start + 2;
      this.text.selectionEnd = end + 2;
    } else if (event.key === '{' || event.key === '[' || event.key === '(') {
      event.preventDefault();
      let completedInput = '{}';
      if (event.key === '[') completedInput = '[]';
      else if (event.key === '(') completedInput = '()';
      this.text.value = this.text.value.slice(0, start) + completedInput + this.text.value.slice(start);
      this.text.selectionStart = start + 1;
      this.text.selectionEnd = end + 1;
    } else if (event.keyCode === 13) {
      event.preventDefault();
      this.text.value = `${this.text.value.slice(0, start)}\n  \n${this.text.value.slice(end)}`;
      this.text.selectionStart = start + 2;
      this.text.selectionEnd = end + 2;
    }
  }

  //=============================================== REDERING

  renderLineNumbers () {
    const linesArr = new Array(50).fill(undefined);
    return (
      <div className="LineNumbers">
        {linesArr.map((el, i) => (('0'+(i+1)).slice(-2))).join('\n')}
      </div>
    );
  }

  render() {
    return (
      <div className="Editor">
        {this.renderLineNumbers()}
        <textarea
          // defaultValue={this.props.ref}
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
