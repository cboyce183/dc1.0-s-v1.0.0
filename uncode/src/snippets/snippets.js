import React, { Component } from 'react';
import axios from 'axios';
import './snippets.css';

import { Snip } from './snip';

export class Snippets extends Component {
  constructor () {
    super();
    this.state = {
      snips: [],
    }
  }

  async componentDidMount() {
    console.log(this.props);
    const response = await axios.get('http://192.168.0.101:4200/snippet/' + this.props.id)
    .catch(e => console.log(e));
    if (response.data) this.setState({ snips:response.data.snippetList });
  }

  renderSnips = () => {
    if (this.state.snips.length) {
      return this.state.snips.map( el => {
        console.log('here');
        return (
          <Snip key={el._id} props={el}/>
        )
      })
    }
  }

  render() {
    return (
      <div className="snippets-container">
        <div className="snippets-title"><h3>Your Code Snippets</h3></div>
        <div className="snippets-body">
          {this.renderSnips()}
        </div>
      </div>
    );
  }
}
