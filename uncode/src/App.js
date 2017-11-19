import React, { Component } from 'react';

import FacebookLogin from 'react-facebook-login';
import AlertContainer from 'react-alert'

import { LogoAnim } from './logo/logo-anim';
import { Snippets } from './snippets/snippets';

import SocketIoClient from 'socket.io-client';
import axios from 'axios';

import About from './About';

import Text from './Text';
import Save from './Save';
import DragDrop from './Dropzone';

import './App.css';

class App extends Component {

  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 7000,
    transition: 'scale'
  }

  constructor(props) {
    super(props);
    this.socket = SocketIoClient('http://localhost:4200');
    this.state = {
      outputText: '',
      inputText: '',
      aboutFlag: false,
      language: 1,
      selected: 'editor',
      id: '',
      name: '',
    }
  }

  componentDidMount() {
    this.socket.on('receive', (data) => {
      if (data) this.setState({outputText: data});
      else this.setState({outputText: 'come on! Keep typing! :)'});
    })
  }

  handleLanguageChange = async (val) => {
    await this.setState({language: val});
    this.handleTextChange(this.state.inputText);
  }

  handleTextChange = (value) => {
    this.setState({inputText: value})
    this.socket.emit('send', value, this.state.language);
  }

  handleTabSelection = (ref) => {
    this.setState({selected: ref})
  }

  handleAboutClick = () => {
    this.setState({aboutFlag:!this.state.aboutFlag})
  }

  handleFileLoad = (content) => {
    console.log(content);
    this.inputText = content;
    this.setState({selected: 'editor'});
  }

  responseFacebook = (res) => {
    console.log(res);
    if (res.name) {
      this.setState({
        name: res.name,
        id: res.id
        })
      this.sendToBack(res);
    }
  }

  sendToBack = (res) => {
    console.log('send', res);
    axios.post('http://192.168.0.101:4200/login', {
      ...res,
    })
  }

  saveSnip = (name) => {
    if (!this.state.inputText) {
      this.msg.error('No Input DickHead');
    } else if (!name.value) {
      this.msg.error(`Can't save a snippet with no title! Please enter one!`);
    } else {
      axios.post('http://192.168.0.101:4200/snippet/save', {
        code: this.state.inputText,
        userId: this.state.id,
        title: name.value
      }).then(res => {
      console.log(res);
      if (res.status === 203) {
        this.msg.error('Snippet title is taken, please pick another one!');
      } else if (res.status === 200) {
        this.msg.success('Saved!')
        name.value = ''
      } else {
        this.msg.error('Server Down')
      }
      })
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

  renderTabSelection = () => {
    if (this.state.selected === 'editor'){
      return (
        <Text
          val={this.inputText}
          func={this.handleTextChange.bind(this)}
          placeholder={"Insert code here"}
        />
      )
    } else if (this.state.selected === 'upload') {
      return (
        <DragDrop
          func={this.handleFileLoad.bind(this)}
        />
      )
    } else {
      return (<Snippets id={this.state.id}/>)
    }
  }

  renderSave = () => {
    return this.state.id && this.state.selected === 'editor' ?
      <Save func={this.saveSnip.bind(this)} /> : null
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
            <div className="button-wrapper" style={{display:'flex', width:'380px', flexFlow:'row nowrap', alignItems:'center', justifyContent:'space-around'}}>
              {this.state.name ? (
                <div>Welcome {this.state.name} </div>
              ) : (
                <FacebookLogin
                  cssClass="Facebook"
                  appId="146642496064470"
                  autoLoad={true}
                  fields="name,email,picture"
                  onClick={this.sendToBack}
                  callback={this.responseFacebook}
                />
              )}
              <div className="about-button" onClick={this.handleAboutClick}>
                <p className="about-button-text">ABOUT</p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexFlow: 'row nowrap',
                width: '90px'
              }}>
                <div className="lang-button"
                  style={{
                    borderBottomLeftRadius: '2px',
                    borderTopLeftRadius: '2px',
                    borderRight: '1px solid #4664a7'
                  }}
                  onClick={() => this.handleLanguageChange(1)}>EN</div>
                <div className="lang-button"
                  onClick={() => this.handleLanguageChange(2)}>ES</div>
                <div className="lang-button"
                  onClick={() => this.handleLanguageChange(3)}>IT</div>
              </div>
            </div>
          </div>
        </nav>
        <div>
          <div className="MaxWidthMain">
            <div className="Explanation">
              <p style={{
                textAlign: 'center',
                width: '100%'
              }}>
                Welcome to uncode! The first platform that simplifies and translates
                convoluted JavaScript into plain human language.
              </p>
            </div>
            <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
            <div className="TabSelector">
              <div className="Tabs">
                <div
                  className={`Tab${this.state.selected === 'editor'
                    ? ' Selected'
                    : ''}`}
                  onClick={() => this.handleTabSelection('editor')}>editor</div>
                <div
                  className={`Tab${this.state.selected === 'upload'
                    ? ' Selected'
                    : ''}`}
                  onClick={() => this.handleTabSelection('upload')}>upload</div>
                <div
                  className={`Tab${this.state.selected === 'snippets'
                    ? ' Selected'
                    : ''}`}
                  onClick={() => this.handleTabSelection('snippets')}>snippets</div>
                </div>
              {this.renderSave()}
            </div>
            <div className="Form">
              {this.renderTabSelection()}
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
