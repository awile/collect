import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../ipc';
import { Button } from '../library/';
import AddLabelPlaceholder from './add-label-placeholder/';
import moment from 'moment';
import { List, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import './_index.scss';

class LeftPane extends Component {
  constructor() {
    super();

    this.state = {
      labels: []
    };

    this.handleAddLabel = this.handleAddLabel.bind(this);
    this.onLabelCreate = this.onLabelCreate.bind(this);
    this.onLabelCancel = this.onLabelCancel.bind(this);
    this.handleLabelRemove = this.handleLabelRemove.bind(this);
    this.handleLabelEdit = this.handleLabelEdit.bind(this);
  }

  componentDidMount() {
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
    if (selectedLabel && newLabel && selectedLabel.id === newLabel.id) {
      onChange(newLabel);
    }
  }

  onLabelCancel(labelId) {
    const { labels } = this.state;
    const label = labels.find(l => l.id === labelId);
    if (label && !label.name) {
      const filteredLabels = labels.filter(l => l.id !== labelId);
      this.setState({ labels: filteredLabels });
    } else {
      const updatedLabels = labels.map(l =>
        l.id === labelId ? Object.assign(l, { isPlaceholder: false }): l);
      this.setState({ labels: updatedLabels });
    }
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

    const actions = (label) => [
      <EditOutlined onClick={() => this.handleLabelEdit(label)}/>,
      <Popconfirm
        placement='right'
        title='Are you sure you want to delete this label?'
        onConfirm={() => this.handleLabelRemove(label)}
        okText='Delete'
        cancelText='Cancel'>
        <DeleteOutlined />
      </Popconfirm>
    ];
    const header = (
        <div className='clt-LeftPane-add-container'>
          <Button onClick={this.handleAddLabel}>+ add label</Button>
          { selectedLabel &&
            <Button
              className='clt-LeftPane-clear'
              onClick={() => onChange('')}>clear</Button> }
        </div>
    );
    return (
      <div className='clt-LeftPane'>
        <List
          header={header}
          className='clt-LeftPane-list-container'
          itemLayout="horizontal"
          size='small'
          split={false}
          rowKey={label => label.id}>
          { labels.map(label => (
            <List.Item
              actions={label.isPlaceholder ? [] : actions(label)}
              key={label.id}
              className='clit-LeftPane-item'>
              {
                label.isPlaceholder ?
                  <AddLabelPlaceholder
                    key={label.id}
                    label={label}
                    onCreate={this.onLabelCreate}
                    onCancel={this.onLabelCancel} /> :
                  <Button
                    className={`clt-LeftPane-name
                      ${selectedLabel && label.id === selectedLabel.id ? 'clt-LeftPane--active' : ''}`}
                    onClick={() => onChange(label)}>
                    {label.name}
                  </Button>
              }
            </List.Item>))
          }
        </List>
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
