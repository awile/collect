
import React from 'react';
import PropTypes from 'prop-types';

class UploadWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileIsHovering: false
    };

    this.ref = React.createRef();
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
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files;
    ([...files]).forEach(file => this.handleFile(file));
  }

  handleFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('event', event)
      const bits = event.target.result;
      console.log('bits', bits)
      // const obj = {
      //   created: new Date(),
      //   data: bits
      // };
    }
    reader.readAsBinaryString(file);
  }

  render() {
    const { fileIsHovering } = this.state;
    const { children } = this.props;

    return (
      <div className={`lib-UploadWrapper ${fileIsHovering ? 'lib-UploadWrapper--active': ''}`} ref={this.ref}>
        {children}
      </div>
    );
  }
}

UploadWrapper.propTypes = {
};

export default UploadWrapper;
