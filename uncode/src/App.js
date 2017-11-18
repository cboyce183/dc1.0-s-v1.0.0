import React, { Component } from 'react';
import './App.css';

import { LogoAnim } from './logo/logo-anim';

import SocketIoClient from 'socket.io-client';

const _ = require('lodash');


class App extends Component {

  constructor(props) {
    super(props);
    this.socket = SocketIoClient('http://localhost:4200');
    this.state = {
      outputText: '',
      inputText: '',
      aboutFlag: false,
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

  handleAboutClick = () => {
    this.setState({aboutFlag:!this.state.aboutFlag})
  }

  renderTeam = () => {
    let arr = [{name:'Charlie', url:'https://github.com/cboyce183'},{name:'Hannah', url:'https://github.com/redspanner'},{name:'Mike',url:'https://github.com/MPastorMeseguer'},{name:'Javier', url:'https://github.com/moranlemusj'},{name:'Jack',url:'https://github.com/vidocco'}]
    arr = _.shuffle(arr);
    return arr.map( el => {
      return (
        <a href={el.url} style={{textDecoration:'none'}}>
          <div style={{padding:'5px',width:'60px',height:'60px',borderRadius:'35px', backgroundColor:'rgb(64,89,147)',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
            <p style={{fontFamily: 'Roboto', fontWeight: 'lighter', color: 'white'}}>{el.name}</p>
          </div>
        </a>
      )
    })
  }

  renderAboutWindow = () => {
    if (this.state.aboutFlag) return (
      <div className="about-container" onClick={this.handleAboutClick}>
        <h1 className="about-title">Made by developers, useful for everyone.</h1>
        <img src={require('./assets/icons8-multicultural-people-100.png')} style={{height:'80px'}}/>
        <h3 className="about-text">uncode.js is a tool for learning how to code JavaScript in the most humanly friendly way possible: code, but in your own, comfortable native language.</h3>
        <div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'space-around'}}>
          <p style={{fontFamily: 'Courier New, monospace;'}}>var foo = 10 + 5;</p>
          <img src={require('./assets/icons8-right-100.png')} style={{height:'30px', padding: '20px'}}/>
          <p>1 var variable foo is assigned to 10 + 5</p>
        </div>
        <h3 className="about-text">Simply start coding, or copy in some code from elsewhere, and read the steps the complier takes to run the code in terms anyone can understand. It is that simple!</h3>
        <h3 className="about-text">The Team: </h3>
        <div style={{display:'flex', flexFlow:'row nowrap',justifyContent:'space-around', paddingBottom:'5vh', width:'40%'}}>{this.renderTeam()}</div>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        {this.renderAboutWindow()}
        <nav className="Header">
          <div className="MaxWidth">
            <LogoAnim />
            <div className="button-wrapper" style={{display:'flex', flexFlow:'row nowrap', alignItems:'center'}}>
              <div className="about-button" onClick={this.handleAboutClick}>
                <p className="about-button-text">about</p>
              </div>
              <div className="spacer" style={{width:'2vw'}}></div>
              <div className="about-button">
                <p className="about-button-text">Eng</p>
              </div>
            </div>
          </div>
        </nav>
        <div>
          <div className="MaxWidthMain">
            <div className="Explanation">
              <p>Welcome to uncode! A new platform that simplifies and translates your JavaScript into plain human language.</p>
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
