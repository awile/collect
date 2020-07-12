
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './PhotoBlock';
import { IPCRenderer } from '../ipc';
import { UploadWrapper } from  '../library/';
import moment from 'moment';
import { Empty } from 'antd';

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
    const { labels } = this.props;

    return (
      <div className='clt-Grid'>
        <UploadWrapper onUpload={this.onFileUpload}>
          <div className='clt-Grid-container'>
            {
              photos.length === 0 ?
                <Empty description={<span>No images.</span>} /> :
                photos.map(photo =>
                  <PhotoBlock key={photo.name} photo={photo} labels={labels} />)
            }
          </div>
        </UploadWrapper>
      </div>
    );
  }
}

Grid.propTypes = {
  selectedLabelId: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string
  }))
}

export default Grid;
