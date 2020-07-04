
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './PhotoBlock';
import { IPCRenderer } from '../ipc';
import { UploadWrapper } from  '../library/';
import moment from 'moment';

import './_index.scss';

class Grid extends Component {
  constructor() {
    super();

    this.state = {
      photos: []
    };
    this.onFileUpload = this.onFileUpload.bind(this);
  }

  componentDidMount() {
    this.getPhotos();
  }

  componentDidUpdate(prevProps) {
    const { selectedLabelId } = this.props;
    if (prevProps.selectedLabelId !== selectedLabelId) {
      this.getPhotos();
    }
  }

  onFileUpload() {
    this.getPhotos();
  }

  async getPhotos() {
    const { selectedLabelId } = this.props;
    let query = {};
    if (selectedLabelId) {
      query.labels = [selectedLabelId];
    }
    const responseChannel = `response-photos-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, photos) => this.setState({ photos }));
    IPCRenderer.send('photos-request', { url: 'SEARCH', body: query, responseChannel });
  }

  render() {
    const { photos } = this.state;

    return (
      <div className='clt-Grid'>
        <UploadWrapper onUpload={this.onFileUpload}>
          <div className='clt-Grid-container'>
            { photos.map(photo => <PhotoBlock photo={photo} />) }
          </div>
        </UploadWrapper>
      </div>
    );
  }
}

Grid.propTypes = {
  selectedLabelId: PropTypes.string
}

export default Grid;
