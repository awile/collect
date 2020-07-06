
import React from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../../ipc';
import moment from 'moment';

import './_upload-wrapper.scss'

class UploadWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileIsHovering: false
    };

    this.ref = React.createRef();
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    const container = this.ref.current;
    container.addEventListener('dragenter', this.handleDragEnter);
    container.addEventListener('dragleave', this.handleDragLeave);
    container.addEventListener('dragover', this.handleDragOver);
    container.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    const container = this.ref.current;
    container.removeEventListener('dragenter', this.handleDragEnter);
    container.removeEventListener('dragleave', this.handleDragLeave);
    container.removeEventListener('dragover', this.handleDragOver);
    container.removeEventListener('drop', this.handleDrop);
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ fileIsHovering: true });
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ fileIsHovering: false });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ fileIsHovering: true });
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    ([...files]).forEach(file => this.handleFile(file));
    this.setState({ fileIsHovering: false });
  }

  handleFile(file) {
    const { onUpload } = this.props;
    const reader = new FileReader();
    reader.onload = (event) => {
      const bits = event.target.result;
      const newPhoto = {
        name: file.name.split('.').slice(0, -1).join(''),
        file_type: file.type.split('/')[1],
        data: bits
      }
      const responseChannel = `response-photos-${moment().toISOString()}`;
      IPCRenderer.once(responseChannel, (event, result) => onUpload && onUpload());
      IPCRenderer.send('photos-request', { url: 'CREATE', body: newPhoto, responseChannel });
    }
    reader.readAsDataURL(file);
  }

  render() {
    const { fileIsHovering } = this.state;
    const { children } = this.props;

    return (
      <div className={`lib-UploadWrapper ${fileIsHovering ? 'lib-UploadWrapper--active': ''}`} ref={this.ref}>
        <div className='lib-UploadWrapper-message'>
          <div>Drop File to Upload</div>
        </div>
        {children}
      </div>
    );
  }
}

UploadWrapper.propTypes = {
  onUpload: PropTypes.func
};

export default UploadWrapper;
