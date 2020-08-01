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
      placeholderLabels: [],
    };

    this.handleAddLabel = this.handleAddLabel.bind(this);
    this.onLabelCreate = this.onLabelCreate.bind(this);
    this.onLabelCancel = this.onLabelCancel.bind(this);
    this.handleLabelRemove = this.handleLabelRemove.bind(this);
    this.handleLabelEdit = this.handleLabelEdit.bind(this);
  }


  handleAddLabel() {
    const { placeholderLabels } = this.state;
    const { labels } = this.props
    const newPlaceholder = {
      id: `${labels.length + placeholderLabels.length + 1}`,
      isCreating: true,
      isPlaceholder: true
    };
    this.setState({ placeholderLabels: [newPlaceholder].concat(placeholderLabels) });
  }

  onLabelCreate(oldLabel, newLabel) {
    const { placeholderLabels } = this.state;
    const { labels } = this.props;
    const { onLabelsUpdate, onChange, selectedLabel } = this.props;
    const filteredLabels = placeholderLabels.filter(pl => pl.id !== oldLabel.id);
    this.setState({ placeholderLabels: filteredLabels });
    const updatedLabels = labels.map(l => l.id === newLabel.id ? newLabel: l);
    onLabelsUpdate(updatedLabels);
    if (selectedLabel && newLabel && selectedLabel.id === newLabel.id) {
      onChange(newLabel);
    }
  }

  onLabelCancel(labelId) {
    const { placeholderLabels} = this.state;
    const filteredLabels = placeholderLabels.filter(l => l.id !== labelId);
    this.setState({ placeholderLabels: filteredLabels });
  }

  handleLabelRemove(label) {
    const responseChannel = `response-labels-${moment().toISOString()}`;
    const { onLabelsUpdate } = this.props;
    IPCRenderer.once(responseChannel, (_, resp) => {
      if (resp.deleted) {
        const { labels } = this.props;
        const filteredLabels = labels.filter(l => l.id !== label.id);
        onLabelsUpdate(filteredLabels);
      }
    });
    IPCRenderer.send('labels-request', { url: 'DELETE', body: { id: label.id }, responseChannel });
  }

  handleLabelEdit(label) {
    const { placeholderLabels } = this.state;
    const { labels } = this.props;
    const labelToEdit = labels.find(l => l.id === label.id);
    this.setState({
      placeholderLabels: placeholderLabels.concat([{ ...labelToEdit, isPlaceholder: true }])
    });
  }

  render() {
    const { placeholderLabels } = this.state;
    const { labels, selectedLabel, onChange } = this.props;

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
    const mergeLabels = (labels, placeholders) => {
      const creatingPlaceholders = placeholders.filter(p => p.isCreating);
      return creatingPlaceholders.concat(labels.map(l => {
        const placeholder = placeholders.find(p => p.id === l.id);
        return !!placeholder ? placeholder : l;
      }));
    }
    return (
      <div className='clt-LeftPane'>
        <List
          header={header}
          className='clt-LeftPane-list-container'
          itemLayout="horizontal"
          size='small'
          split={false}
          rowKey={label => label.id}>
          { (mergeLabels(labels, placeholderLabels)).map(label => (
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
  labels: PropTypes.array,
  setLabels: PropTypes.func,
  onChange: PropTypes.func,
  onLabelsUpdate: PropTypes.func
};

export default LeftPane;
