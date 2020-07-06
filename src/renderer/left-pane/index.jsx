import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../ipc';
import { Button } from '../library/';
import AddLabelPlaceholder from './add-label-placeholder/';
import moment from 'moment';

import './_index.scss';

class LeftPane extends Component {
  constructor() {
    super();

    this.state = {
      labels: []
    };

    this.handleAddLabel = this.handleAddLabel.bind(this);
    this.onLabelCreate = this.onLabelCreate.bind(this);
    this.onLabelRemove = this.onLabelRemove.bind(this);
  }

  componentDidMount() {
    const labels = [{ id: '123', name: 'photos' }];
    this.setState({ labels });
    this.getLabels();
  }

  getLabels() {
    const query = {};
    const responseChannel = `response-labels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, labels) => this.setState({ labels }));
    IPCRenderer.send('labels-request', { url: 'SEARCH', body: query, responseChannel });
  }

  handleAddLabel() {
    const { labels } = this.state;
    this.setState({ labels: [{ id: `${labels.length + 1}`, isPlaceholder: true }].concat(labels) });
  }

  onLabelCreate(oldLabel, newLabel) {
    const { labels } = this.state;
    const updatedLabels = labels.map(l => l.id === oldLabel.id ? newLabel : l);
    this.setState({ labels: updatedLabels });
  }

  onLabelRemove(labelId) {
    const { labels } = this.state;
    const filteredLabels = labels.filter(l => l.id !== labelId);
    this.setState({ labels: filteredLabels });
  }

  handleLabels() {
    const query = {};
    IPCRenderer.send('labels-request', { url: 'GET', body: query});
  }

  render() {
    const { labels } = this.state;
    const { selectedLabel, onChange } = this.props;

    return (
      <div className='clt-LeftPane'>
        <div className='clt-LeftPane-add-container'>
          <Button onClick={this.handleAddLabel}>+ add label</Button>
        </div>
        <div className='clt-LeftPane-list-container'>
          { labels.map(label =>
            label.isPlaceholder ?
              <AddLabelPlaceholder
                key={label.id}
                label={label}
                onCreate={this.onLabelCreate}
                onRemove={this.onLabelRemove} /> :
              <span
                key={label.id}
                className={`clt-LeftPane-item ${selectedLabel && label.id === selectedLabel.id ? 'clt-LeftPane--active' : ''}`}
                onClick={() => onChange(label)}>
                {label.name}
              </span>)
          }
          <hr />
          <span className='clt-LeftPane-item' onClick={() => onChange('')}>clear</span>
        </div>
      </div>
    );
  }
}

LeftPane.propTypes = {
  selectedLabel: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  onChange: PropTypes.func
};

export default LeftPane;
