
import React, { Component } from 'react';

import NavBar from './nav-bar/index';
import LeftPane from './left-pane/index';
import Grid from './grid/index';

class App extends Component {

  constructor() {
    super();

    this.state = {
      selectedLabel: null
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(label) {
    this.setState({ selectedLabel: label });
  }

  render() {
    const { selectedLabel } = this.state;

    return (
      <div className='clt-App'>
        <NavBar selectedLabelName={selectedLabel ? selectedLabel.name : ''} />
        <div className='clt-App-mainContainer'>
          <LeftPane selectedLabel={selectedLabel} onChange={this.onChange} />
          <Grid selectedLabelId={selectedLabel && selectedLabel.id} />
        </div>
      </div>
    );
  }
}

export default App;
