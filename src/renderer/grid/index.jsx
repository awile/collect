
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './photo-block/PhotoBlock';
import { IPCRenderer } from '../ipc';
import { UploadWrapper } from  '../library/';
import moment from 'moment';
import { Empty } from 'antd';
import { WindowScroller, Collection } from 'react-virtualized';

import './_index.scss';

class Grid extends Component {
  constructor() {
    super();

    this.state = {
      photos: [],
      width: 0,
      height: 0
    };

    this.onFileUpload = this.onFileUpload.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.ref = React.createRef();
    this.collectionRef = React.createRef();
    this.handleDelete = this.handleDelete.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
  }

  componentDidMount() {
    this.getPhotos();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    if (this.ref) {
      this.setState({
        height: e.target.outerHeight - 40, // header height
        width: e.target.outerWidth - 230   // side pane width
      });
    }
    if (this.collectionRef) {
      this.collectionRef.current.recomputeCellSizesAndPositions();
    }
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

  handleRef(input) {
    if (input) {
      this.ref.current = input;
      this.setState({ width: input.offsetWidth, height: input.offsetHeight });
    }
  }

  handleDelete(photoId) {
    const query = { id: photoId };
    const responseChannel = `response-photos-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, result) => this.getPhotos());
    IPCRenderer.send('photos-request', { url: 'DELETE', body: query, responseChannel });
  }

  async getPhotos() {
    const { photos } = this.state;
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
    const { photos, height, width } = this.state;
    const { labels, selectedLabelId } = this.props;

    const photoBlockRenderer = ({index, key, style}) => {
      const photo = photos[index];
      return (
        <PhotoBlock
          className={style.cell}
          selectedLabelId={selectedLabelId}
          style={style}
          key={key}
          photo={photo}
          onDelete={this.handleDelete}
          labels={labels} />
      );
    };
    const cellSizeAndPositionGetter = (width, height, index) => {
      const perRow = Math.floor((width ?? 200) / 210) || 4;
      const blockSizeX = 200;
      const blockSizeY = 260;
      const gap = 10;
      return {
        height: blockSizeY,
        width: blockSizeX,
        x: (index % perRow) * (blockSizeX + gap),
        y: Math.floor(index / perRow) * (blockSizeY + gap),
      };
    };

    return (
      <div className='clt-Grid'>
        <UploadWrapper params={{ label: selectedLabelId }} onUpload={this.onFileUpload}>
          <div className='clt-Grid-container' ref={this.handleRef}>
            {
              photos.length === 0 ?
                <Empty description={<span>No images.</span>} /> :
                <Collection
                  ref={this.collectionRef}
                  cellCount={photos.length}
                  cellRenderer={photoBlockRenderer}
                  cellSizeAndPositionGetter={({ index }) =>
                    cellSizeAndPositionGetter(width, height, index)}
                  height={height}
                  width={width ?? 100}
                  data={labels} />
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
