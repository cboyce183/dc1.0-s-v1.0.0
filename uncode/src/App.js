import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import Dropzone from 'react-dropzone';

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
    this.lines = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]
  }

  handleFileChange = files => {
    try { var reader = new FileReader();
    reader.onload = () => {
      this.inputText.value = reader.result;
      console.log(reader.result)
    }
    console.log(reader.readAsText(files[0]));
  } catch (e) {
    alert('Invalid file type, please upload a JavaScript file');
    }
  }

  componentDidMount() {
    this.socket.on('receive', (data) => {
      console.log(data)
      if (data) this.setState({outputText: data});
      else this.setState({outputText: 'come on! Keep typing! :)'});
    })
  }

  handleTextChange = (value) => {
    this.socket.emit('send', value);
  }

  //=============================================== REDERING

  renderLineNumbers () {
    return (<textarea readOnly className="LineNumbers">{this.lines.map(el => (('0'+el).slice(-2))+'|').join('\n')}</textarea>)
  }

  render() {
    const lineNumbers = this.renderLineNumbers();
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
            {/* <Dropzone className="DropZone" onDrop={this.handleFileChange} accept='.js'>
              <ReactFileReader handleFiles={this.handleFileChange} 
                              fileTypes={'.js'}>
                <button className="">Upload</button>
              </ReactFileReader>
            </Dropzone> */}
            <div className="Form">
              <Text 
                func={this.handleTextChange.bind(this)}
                placeholder="INSERT CODE HERE"
              />
              <div className="Separator"></div>
              <div className="Editor">
                {lineNumbers}
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
