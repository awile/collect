
import "regenerator-runtime/runtime"; // required to fix error
import React, { Component } from 'react';
import moment from 'moment';

import NavBar from './nav-bar/index';
import LeftPane from './left-pane/index';
import Grid from './grid/index';
import { IPCRenderer } from './ipc';

class App extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      selectedLabel: null,
      labels: []
    };
    this.onChange = this.onChange.bind(this);
    this.getLabels = this.getLabels.bind(this);

    const statusCheckChannel = 'main-status-check';
    IPCRenderer.on('main-status', (event, check) => {
      if (check.status === 'ok') {
        this.setState({ loading: false });
        IPCRenderer.removeAllListeners('main-status');
        this.getLabels();
      } else {
        IPCRenderer.send(statusCheckChannel, []);
      }
    });
    IPCRenderer.send(statusCheckChannel, []);
  }

  onChange(label) {
    this.setState({ selectedLabel: label });
  }

  getLabels() {
    const query = {};
    const responseChannel = `response-labels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, labels) => this.setState({ labels }));
    IPCRenderer.send('labels-request', { url: 'SEARCH', body: query, responseChannel });
  }

  render() {
    const { labels, loading, selectedLabel } = this.state;

    return (
      <div className='clt-App'>
        <NavBar selectedLabelName={selectedLabel ? selectedLabel.name : ''} />
        { loading ?
          <div className='clt-App-loading'>loading...</div> :
          <div className='clt-App-mainContainer'>
            <LeftPane selectedLabel={selectedLabel} onChange={this.onChange} />
            <Grid selectedLabelId={selectedLabel && selectedLabel.id} labels={labels}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
