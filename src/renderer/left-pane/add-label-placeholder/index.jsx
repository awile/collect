import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../library/';
import { IPCRenderer } from '../../ipc';
import moment from 'moment';
import { Typography } from 'antd';
const { Text } = Typography;

import './_add-label-placeholder.scss';

class AddLabelPlaceholder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  componentDidMount() {
    const { label } = this.props;
    if (label && label.name) {
      this.setState({ value: label.name });
    }
  }

  handleChange(event) {
    const text = event.target.value;
    this.setState({ value: text });
  }

  handleCreate() {
    const { label, onCreate } = this.props;
    const { value } = this.state;
    const responseChannel = `response-labels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, newLabel) => {
      onCreate(label, newLabel)
    });
    let body;
    if (label.name) {
      body = Object.assign(label, { name: value });
      IPCRenderer.send('labels-request', { url: 'UPDATE', body, responseChannel });
    } else {
      body = { name: value };
      IPCRenderer.send('labels-request', { url: 'CREATE', body, responseChannel });
    }
  }

  handleEnter(e) {
    if (e.key === 'Enter') {
      this.handleCreate();
    }
  }

  handleRemove() {
    const { label, onRemove } = this.props;
    onRemove(label.id);
  }

  render() {
    const { value } = this.state;

    return (
      <div className='alp-AddLabelPlaceholder'>
        <input
          className='alp-AddLabelPlaceholder-input'
          type='text'
          onKeyDown={this.handleEnter}
          onChange={this.handleChange}
          value={value}>
        </input>
        <Button
          className='alp-AddLabelPlaceholder-create'
          onClick={this.handleCreate}>√</Button>
        <Button
          className='alp-AddLabelPlaceholder-remove'
          onClick={this.handleRemove}>X</Button>
      </div>
    );
  }
}

AddLabelPlaceholder.propTypes = {
  label: PropTypes.shape({
    id: PropTypes.string
  }),
  onCreate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default AddLabelPlaceholder;
