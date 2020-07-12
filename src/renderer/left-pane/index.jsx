import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../ipc';
import { Button } from '../library/';
import AddLabelPlaceholder from './add-label-placeholder/';
import moment from 'moment';
import {
  Popconfirm
} from 'antd';
import {
  CloseOutlined,
  EditOutlined
} from '@ant-design/icons';

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
    this.handleLabelRemove = this.handleLabelRemove.bind(this);
    this.handleLabelEdit = this.handleLabelEdit.bind(this);
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
    const { onChange, selectedLabel } = this.props;
    const updatedLabels = labels.map(l => l.id === oldLabel.id ? newLabel : l);
    this.setState({ labels: updatedLabels });
    if (selectedLabel.id === newLabel.id) {
      onChange(newLabel);
    }
  }

  onLabelRemove(labelId) {
    const { labels } = this.state;
    const filteredLabels = labels.filter(l => l.id !== labelId);
    this.setState({ labels: filteredLabels });
  }

  handleLabelRemove(label) {
    const responseChannel = `response-labels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, resp) => {
      if (resp.deleted) {
        const { labels } = this.state;
        const filteredLabels = labels.filter(l => l.id !== label.id);
        this.setState({ labels: filteredLabels });
      }
    });
    IPCRenderer.send('labels-request', { url: 'DELETE', body: { id: label.id }, responseChannel });
  }

  handleLabelEdit(label) {
    const { labels } = this.state;
    const updatedLabels = labels.map(l =>
      l.id === label.id ? Object.assign(l, { isPlaceholder: true }) : l);
    this.setState({ labels: updatedLabels });
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
              <div
                key={label.id}
                className='clt-LeftPane-item'>

                <Button
                  className={selectedLabel && label.id === selectedLabel.id ? 'clt-LeftPane--active' : ''}
                  onClick={() => onChange(label)}>
                  {label.name}
                </Button>
                <div className='clt-LeftPane-options'>
                  <EditOutlined onClick={() => this.handleLabelEdit(label)}/>
                  <Popconfirm
                    placement='right'
                    title='Are you sure you want to delete this label?'
                    onConfirm={() => this.handleLabelRemove(label)}
                    okText='Delete'
                    cancelText='Cancel'>
                    <CloseOutlined />
                  </Popconfirm>
                </div>
              </div>)
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
