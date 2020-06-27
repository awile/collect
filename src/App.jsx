
import React, { Component } from 'react';

import NavBar from './nav-bar/index';
import LeftPane from './left-pane/index';
import Grid from './grid/index';

class App extends Component {

  constructor() {
    super();

    this.state = {
      text: ''
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(text) {
    this.setState({ text });
  }

  render() {
    const { text } = this.state;

    return (
      <div className='clt-App'>
        <NavBar text={text} />
        <div className='clt-App-mainContainer'>
          <LeftPane text={text} onChange={this.onChange} />
          <Grid text={text} />
        </div>
      </div>
    );
  }
}

export default App;
