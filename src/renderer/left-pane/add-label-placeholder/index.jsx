import React from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../../ipc';
import moment from 'moment';
import { Input, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
const { Text } = Typography;

import './_add-label-placeholder.scss';

class AddLabelPlaceholder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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

  handleCancel() {
    const { label, onCancel } = this.props;
    const { value } = this.state;
    if (value !== '') {
      this.setState({ value: '' });
    } else {
      onCancel(label.id);
    }
  }

  render() {
    const { value } = this.state;

    const CancelIcon = (<CloseOutlined onClick={this.handleCancel} />);
    const CreateIcon = (
      <CheckOutlined
        className='alp-AddLabelPlaceholder-check-btn'
        onClick={this.handleCreate} />
    );
    return (
      <div className='alp-AddLabelPlaceholder'>
        <Input
          autoFocus
          className='alp-AddLabelPlaceholder-input'
          type='text'
          placeholder='label name...'
          onKeyDown={this.handleEnter}
          onChange={this.handleChange}
          suffix={CancelIcon}
          addonAfter={CreateIcon}
          value={value}>
        </Input>
      </div>
    );
  }
}

AddLabelPlaceholder.propTypes = {
  label: PropTypes.shape({
    id: PropTypes.string
  }),
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AddLabelPlaceholder;
