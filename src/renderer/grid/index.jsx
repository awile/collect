
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './PhotoBlock';
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
  }

  componentDidMount() {
    this.getPhotos();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    if (this.ref) {
      this.setState({
        height: this.ref.current.offsetHeight,
        width: this.ref.current.offsetWidth
      });
    }
    if (this.collectionRef) {
      this.collectionRef.recomputeCellSizesAndPositions();
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
    const { photos, height, width } = this.state;
    const { labels } = this.props;

    const photoBlockRenderer = ({index, key, style}) => {
      const photo = photos[index];
      return (
        <PhotoBlock className={style.cell} style={style} key={key} photo={photo} labels={labels} />
      );
    };
    const cellSizeAndPositionGetter = (width, height, index) => {
      const perRow = Math.floor((width ?? 200) / 210);
      const blockSize = 200;
      const gap = 10;
      return {
        height: blockSize,
        width: blockSize,
        x: (index % perRow) * (blockSize + gap),
        y: Math.floor(index / perRow) * (blockSize + gap),
      };
    };

    return (
      <div className='clt-Grid'>
        <UploadWrapper onUpload={this.onFileUpload}>
          <div className='clt-Grid-container' ref={this.handleRef}>
            {
              photos.length === 0 ?
                <Empty description={<span>No images.</span>} /> :
                <Collection
                  ref={ref => this.collectionRef = ref}
                  cellCount={photos.length}
                  cellRenderer={photoBlockRenderer}
                  cellSizeAndPositionGetter={({ index }) => cellSizeAndPositionGetter(width, height, index)}
                  height={height}
                  width={width ?? 100} />
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
