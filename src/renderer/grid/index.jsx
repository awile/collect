
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './photo-block/PhotoBlock';
import { IPCRenderer } from '../ipc';
import { UploadWrapper } from  '../library/';
import moment from 'moment';
import { Button, Empty, message } from 'antd';
import { WindowScroller, Collection } from 'react-virtualized';
import CreatableSelect from 'react-select/creatable';

import './_index.scss';

class Grid extends Component {
  constructor() {
    super();

    this.state = {
      photos: [],
      selectedPhotos: [],
      labelsToApply: [],
      width: 0,
      height: 0
    };

    this.onFileUpload = this.onFileUpload.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.ref = React.createRef();
    this.collectionRef = React.createRef();
    this.handleDelete = this.handleDelete.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleApplyLabels = this.handleApplyLabels.bind(this);
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

  handleChange(labels) {
    this.setState({ labelsToApply: labels });
  }

  handleApplyLabels() {
    const { labelsToApply } = this.state;
    const labelsToCreate = labelsToApply.filter(l => l.__isNew__);
    if (labelsToCreate.length > 0) {
      this.createLabels(labelsToCreate)
        .then(newLabels => {
          const labels = labelsToApply.map(l => {
            if (l.__isNew__) {
              const newLabel = newLabels.find(nl => nl.name === l.label);
              return newLabel.id;
            }
            return l.value;
          });
          this.applyLabels(labels);
        })
        .catch(err => console.error(err));
    } else {
      this.applyLabels(labelsToApply);
    }
  }

  applyLabels(labels) {
    const { selectedPhotos } = this.state;
    const query = {
      photos: selectedPhotos,
      labels
    };
    const responseChannel = `response-photoLabels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, () => {
      this.setState({ photos: [], selectedPhotos: [], labelsToApply: [] }, () => {
        message.success(`${labels.length} labels added to ${selectedPhotos.length} photos`);
      });
      this.getPhotos();
    });
    IPCRenderer.send('photoLabels-request', { url: 'CREATE_BULK', body: query, responseChannel });
  }

  createLabels(newLabels) {
    return new Promise((resolve) => {
      let labelsCreated = 0;
      let newLabelValues = [];
      newLabels.forEach((l, i) => {
        const responseChannel = `response-labels-${moment().toISOString()}-${i}`;
        IPCRenderer.once(responseChannel, (_, label) => {
          labelsCreated += 1;
          newLabelValues.push(label);
          if (labelsCreated === newLabels.length) {
            message.success(`${newLabels.length} labels created`);
            resolve(newLabelValues);
          }
        });
        const body = { name: l.value };
        IPCRenderer.send('labels-request', { url: 'CREATE', body, responseChannel });
      });
    });
  }

  handleDelete(photoId) {
    const query = { id: photoId };
    const responseChannel = `response-photos-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, result) => this.getPhotos());
    IPCRenderer.send('photos-request', { url: 'DELETE', body: query, responseChannel });
  }

  handleSelect(photoId) {
    const { selectedPhotos } = this.state;
    let updatedSelectedPhotos = selectedPhotos;
    const index = updatedSelectedPhotos.indexOf(photoId);
    if (index >= 0) {
      updatedSelectedPhotos.splice(index, 1);
    } else {
      updatedSelectedPhotos.push(photoId);
    }
    this.setState({ selectedPhotos: updatedSelectedPhotos });
  }

  async getPhotos() {
    const { photos } = this.state;
    const { selectedLabelId } = this.props;
    let query = {};
    if (selectedLabelId) {
      query.labels = [selectedLabelId];
    }
    const responseChannel = `response-photos-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, photos) => { console.log('photos', photos); this.setState({ photos }); });
    IPCRenderer.send('photos-request', { url: 'SEARCH', body: query, responseChannel });
  }

  render() {
    const { photos, height, selectedPhotos, width } = this.state;
    const { labels, selectedLabelId } = this.props;

    const photoBlockRenderer = ({index, key, style}) => {
      const photo = photos[index];
      const isSelected = selectedPhotos.includes(photo.id);
      return (
        <PhotoBlock
          className={style.cell}
          selectedLabelId={selectedLabelId}
          isSelected={isSelected}
          style={style}
          key={key}
          photo={photo}
          onDelete={this.handleDelete}
          onSelectPhoto={this.handleSelect}
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

    const selectHeight = 28;
    return (
      <div className='clt-Grid'>
        <div className='clt-Grid-options-bar'>
          { selectedPhotos.length > 0 &&
            <React.Fragment>
              <div className='clt-Grid-select-info'>
                <span>{`${selectedPhotos.length} photos selected`}</span>
                <Button type="link" onClick={() => this.setState({ selectedPhotos: [] })}>
                  deselect all
                </Button>
              </div>
              <div className='clt-Grid-options-selector'>
                <CreatableSelect
                  classNamePrefix="mySelect"
                  isClearable
                  isMulti
                  defaultValue={[]}
                  name="labels"
                  onChange={this.handleChange}
                  options={labels.map(l => ({ label: l.name, value: l.id }))}
                  className="clt-Grid-add-labels"
                  classNamePrefix="select"
                  placeholder='add a label...'
                  styles={{
                    control: base => ({
                      ...base,
                      height: selectHeight,
                      minHeight: selectHeight
                    }),
                    valueContainer: base => ({
                      ...base,
                      height: selectHeight,
                      minHeight: selectHeight,
                      padding: '0 6px'
                    }),
                    input: base => ({
                      ...base,
                      height: selectHeight,
                      minHeight: selectHeight,
                      margin: 0
                    }),
                    indicatorsContainer: base => ({
                      ...base,
                      height: selectHeight
                    }),
                    multiValueLabel: base => ({
                      ...base,
                      height: 18,
                      minHeight: 18,
                      padding: 0
                    })
                  }}
                />
                <Button
                  className='clt-Grid-apply-labels'
                  onClick={this.handleApplyLabels}
                  size='small'
                  type="primary">
                  Add Labels
                </Button>
              </div>
            </React.Fragment>
          }
        </div>
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
