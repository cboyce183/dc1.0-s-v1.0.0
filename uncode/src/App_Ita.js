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
        <h1 className="about-title">Realizzato da sviluppatori, utile per tutti.</h1>
        <img src={require('./assets/icons8-multicultural-people-100.png')} style={{height:'80px'}}/>
        <h3 className="about-text">uncode.js è uno strumento per imparare a codificare JavaScript nel modo più umanamente possibile: il codice, ma nella tua lingua madre.</h3>
        <div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'space-around'}}>
          <p style={{fontFamily: 'Courier New, monospace;'}}>var foo = 10 + 5;</p>
          <img src={require('./assets/icons8-right-100.png')} style={{height:'30px', padding: '20px'}}/>
          <p>1 var variabile foo è assegnata a 10 + 5</p>
        </div>
        <h3 className="about-text">Semplicemente inizia a codificare, o copia il codice, e leggi i passaggi necessari per eseguire il codice in termini che chiunque può capire. È così semplice!</h3>
        <h3 className="about-text">Il gruppo: </h3>
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
                <p className="about-button-text">Informazione</p>
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
              <p>Benvenuti a uncode! Una nuova piattaforma che semplifica e traduce il tuo JavaScript a un linguaggio semplice.</p>
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
