
import "regenerator-runtime/runtime"; // required to fix error
import React, { Component } from 'react';

import NavBar from './nav-bar/index';
import LeftPane from './left-pane/index';
import Grid from './grid/index';
import { UploadWrapper } from  './library/';
import { IPCRenderer } from './ipc';

class App extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      selectedLabel: null
    };
    this.onChange = this.onChange.bind(this);
    IPCRenderer.on('ready', () => {
      this.setState({ loading: false });
    });
  }

  onChange(label) {
    this.setState({ selectedLabel: label });
  }

  render() {
    const { loading, selectedLabel } = this.state;

    return (
      <div className='clt-App'>
        <NavBar selectedLabelName={selectedLabel ? selectedLabel.name : ''} />
        { loading ?
          <div>loading...</div> :
          <div className='clt-App-mainContainer'>
            <LeftPane selectedLabel={selectedLabel} onChange={this.onChange} />
            <UploadWrapper>
              <Grid selectedLabelId={selectedLabel && selectedLabel.id} />
            </UploadWrapper>
          </div>
        }
      </div>
    );
  }
}

export default App;
