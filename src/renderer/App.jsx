
import "regenerator-runtime/runtime"; // required to fix error
import React, { Component } from 'react';

import NavBar from './nav-bar/index';
import LeftPane from './left-pane/index';
import Grid from './grid/index';
import { IPCRenderer } from './ipc';

class App extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      selectedLabel: null
    };
    this.onChange = this.onChange.bind(this);

    const statusCheckChannel = 'main-status-check';
    IPCRenderer.on('main-status', (event, check) => {
      if (check.status === 'ok') {
        this.setState({ loading: false });
        IPCRenderer.removeAllListeners('main-status');
      } else {
        IPCRenderer.send(statusCheckChannel, []);
      }
    });
    IPCRenderer.send(statusCheckChannel, []);
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
          <div className='clt-App-loading'>loading...</div> :
          <div className='clt-App-mainContainer'>
            <LeftPane selectedLabel={selectedLabel} onChange={this.onChange} />
            <Grid selectedLabelId={selectedLabel && selectedLabel.id} />
          </div>
        }
      </div>
    );
  }
}

export default App;
