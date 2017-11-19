import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import Dropzone from 'react-dropzone';

import { LogoAnim } from './logo/logo-anim';

import SocketIoClient from 'socket.io-client';

import Text from './Text';
import About from './About';

import './App.css';
const _ = require('lodash');

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = SocketIoClient('http://localhost:4200');
    this.state = {
      outputText: '',
      inputText: '',
      aboutFlag: false,
      language: 1,
    }
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
      if (data) this.setState({outputText: data});
      else this.setState({outputText: 'come on! Keep typing! :)'});
    })
  }

  async handleLanguageChange(val) {
    await this.setState({language: val});
    this.handleTextChange(this.state.inputText);
  }

  handleTextChange = (value) => {
    this.setState({inputText: value})
    this.socket.emit('send', value, this.state.language);
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

  handleAboutClick = () => {
    this.setState({aboutFlag:!this.state.aboutFlag})
  }

  render() {
    return (
      <div className="App">
        <About
          display={this.state.aboutFlag}
          handleDisplay={this.handleAboutClick.bind(this)}/>
        <nav className="Header">
          <div className="MaxWidth">
            <LogoAnim />
            <div className="button-wrapper" style={{display:'flex', flexFlow:'row nowrap', alignItems:'center'}}>
              <div className="about-button" onClick={this.handleAboutClick}>
                <p className="about-button-text">ABOUT</p>
              </div>
              <div className="spacer" style={{width:'2vw'}}></div>
              <div className="lang-button"
                style={{borderBottomLeftRadius: '2px', borderTopLeftRadius: '2px', borderRight: '1px solid #4664a7'}}
                onClick={() => this.handleLanguageChange(1)}>
                <p className="about-button-text">EN</p>
              </div>
              <div className="lang-button"
                onClick={() => this.handleLanguageChange(2)}>
                <p className="about-button-text">ES</p>
              </div>
              <div className="lang-button"
                onClick={() => this.handleLanguageChange(3)}>
                <p className="about-button-text">IT</p>
              </div>
            </div>
          </div>
        </nav>
        <div>
          <div className="MaxWidthMain">
            <div className="Explanation">
              <p>Welcome to uncode! The first platform that simplifies and translates convoluted JavaScript into plain human language.</p>
            </div>
            {/* <Dropzone className="DropZone" onDrop={this.handleFileChange} accept='.js'>
              <ReactFileReader handleFiles={this.handleFileChange} 
                              fileTypes={'.js'}>
                <button className="">Upload</button>
              </ReactFileReader>
            </Dropzone> */}
            <div className="TabSelector">
              <div 
                className="Tab Selected">editor</div>
              <div 
                className="Tab">upload</div>
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
