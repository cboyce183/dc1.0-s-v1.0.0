import React, { Component } from 'react';
import './App.css';

import { LogoAnim } from './logo/logo-anim';

import SocketIoClient from 'socket.io-client';

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
      console.log(data)
      this.setState({outputText: data});
    })
  }

  handleTextChange = () => {
    this.socket.emit('send', this.inputText.value);
  }

  render() {
    return (
      <div className="App">
        <nav className="Header">
          <div className="MaxWidth">
            <LogoAnim />
          </div>
        </nav>
        <div>
          <div className="MaxWidth">
            <div className="Explanation">
              <p>Welcome to uncode! The first platform that simplifies and translates convoluted JavaScript into plain human language.</p>
            </div>
            <div className="Form">
              <textarea
                ref={el => this.inputText = el}
                onChange={this.handleTextChange}
                className="Text"
                placeholder="INSERT CODE HERE"/>
              <div className="Separator"></div>
              <textarea
                className="Text"
                value={this.state.outputText}
                placeholder="OUTPUT GOES HERE"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
