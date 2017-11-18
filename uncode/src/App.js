import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
            <h1>UNCODE</h1>
          </div>
        </nav>
        <div>
          <div className="MaxWidth">
            <div className="Form">
              <input
                ref={el => this.inputText = el}
                type="text"
                onChange={this.handleTextChange}
                className="Text"/>
              <div className="Separator"></div>
              <input className="Text" value={this.state.outputText} placeholder="OUTPUT GOES HERE"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
