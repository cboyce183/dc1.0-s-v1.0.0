import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SocketIoClient from 'socket.io-client';
import ReactFileReader from 'react-file-reader';

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = SocketIoClient('http://localhost:4200');
    this.state = {
      outputText: '',
      inputText: '',
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

  handleFileChange = files => {
    var reader = new FileReader();
    reader.onload = () => {
      this.inputText.value = reader.result;
      console.log(reader.result)
    }
    console.log(reader.readAsText(files[0]));
  }

  render() {
    return (
      <div className="App">
        <ReactFileReader handleFiles={this.handleFileChange} 
                         fileTypes={'.js'}>
          <button className='btn'>Upload</button>
        </ReactFileReader>
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
