import React, { Component } from 'react';
import './logo.css';

export class LogoAnim extends Component {
  constructor () {
    super();
    this.state = {
      flag: false,
    }
    this.wait;
  }
  componentDidMount () {
    setTimeout( () => {
      this.wait = {animation: "boxxy 5s ease-in-out infinite"}
      this.setState({flag:!this.state.flag})
    },3500);
  }
  handleAnimationChange = () => {
    this.setState({flag:!this.state.flag})
  };

  handleAnimation = () => {
    if (!this.state.flag) {
      return (
          <div class="logo-lander" style={{animation: 'contract 3.5s ease'}}>
            <p style={{color:'cyan'}}>console</p>
            <p style={{color:'rgb(255, 0, 84)'}}>.</p>
            <p style={{color:'cyan'}}>log</p>
            <p style={{color:'white'}}>(uncode</p>
            <p style={{color:'rgb(255, 0, 84)'}}>.</p>
            <p style={{color:'rgb(163, 222, 46)'}}>call</p>
            <p style={{color:'white'}}>(this, </p>
            <p style={{color:'rgb(255, 0, 84)'}}>...</p>
            <p style={{color:'white'}}>arguments));</p>
          </div>
      )
    }
    return (
        <div class="subcontainer" style={{animation: 'expand 2.0s linear'}}>
          <p class="logo-uncode">uncode</p>
          <p class="logo-js">.js</p>
        </div>
    )
  }

  render() {
    return (
      <div className="container" onClick={this.handleAnimationChange}>
        <img class="logo" src={require('../assets/logobox.png')} style={this.wait}/>
        {this.handleAnimation()}
      </div>
    );
  }
}
