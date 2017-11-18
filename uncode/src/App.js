import React, { Component } from 'react';

import SocketIoClient from 'socket.io-client';

import Text from './Text';

import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.socket = SocketIoClient('http://localhost:4200');
    this.state = {
      outputText: '',
      inputText: ''
    }
  }

  componentDidMount() {
    this.socket.on('receive', (data) => {
      if (data) this.setState({outputText: data});
      else this.setState({outputText: 'come on! Keep typing! :)'});
    })
  }

  handleTextChange = (value) => {
    this.socket.emit('send', value);
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
      <div className="App">
        <nav className="Header">
          <div className="MaxWidth">
            <h1>UNCODE</h1>
          </div>
        </nav>
        <div>
          <div className="MaxWidth">
            <div className="Explanation">
              <p>Welcome to uncode! The first platform that simplifies and translates convoluted JavaScript into plain human language.</p>
            </div>
            <div className="Form">
              <Text
                func={this.handleTextChange.bind(this)}
                placeholder="INSERT CODE HERE"
              />
              <div className="Separator"></div>
              <div className="Editor">
                {this.renderLineNumbers()}
                <textarea
                  className="Text"
                  value={this.state.outputText}
                  placeholder="OUTPUT GOES HERE"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
