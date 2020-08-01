
import "regenerator-runtime/runtime"; // required to fix error
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import NavBar from './nav-bar/index';
import LeftPane from './left-pane/index';
import Grid from './grid/index';
import { IPCRenderer } from './ipc';
import { Layout } from 'antd';
import { LabelsContext } from './global-state/';

import './_app.scss';

const { Content, Sider } = Layout;


function App() {

  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [labels, setLabels] = useState([]);

  const getLabels = () => {
    const responseChannel = `response-labels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (_, labels) => setLabels(labels));
    IPCRenderer.send('labels-request', { url: 'SEARCH', body: {} , responseChannel });
  }

  useEffect(() => {
    if (loading) {
      const statusCheckChannel = 'main-status-check';
      IPCRenderer.on('main-status', (_, check) => {
        if (check.status === 'ok') {
          setLoading(false);
          IPCRenderer.removeAllListeners('main-status');
          getLabels();
        } else {
          IPCRenderer.send(statusCheckChannel, []);
        }
      });
      IPCRenderer.send(statusCheckChannel, []);
    }
  });

  return (
    <LabelsContext.Provider value={{ labels, setLabels }}>
      <Layout className='clt-App'>
        <NavBar
          selectedLabelName={selectedLabel ? selectedLabel.name : ''}
          labels={labels}
          onChange={label => setSelectedLabel(label)} />
        <Layout>
            <div className='clt-App-mainContainer'>
              <Sider className='clt-App-sider' width={200}>
                <LeftPane
                  labels={labels}
                  setLabels={setLabels}
                  selectedLabel={selectedLabel}
                  onChange={label => setSelectedLabel(label)}
                  onLabelsUpdate={setLabels}/>
              </Sider>
              <Content>
                { loading ?
                  <div className='clt-App-loading'>loading...</div> :
                  <Grid selectedLabelId={selectedLabel && selectedLabel.id} labels={labels} setLabels={setLabels}/> }
              </Content>
            </div>
        </Layout>
      </Layout>
    </LabelsContext.Provider>
  );
}

export default App;
