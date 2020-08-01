
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { IPCRenderer } from '../../ipc';
import {
  Button,
  Input,
  Modal,
  message,
  Popconfirm,
  Select,
  Tag,
  Tooltip
} from 'antd';
const { Option } = Select;
import { ProfileOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import DetailPage from '../detail-page/DetailPage';

import './_photo-block.scss';

class PhotoBlock extends Component {
  constructor() {
    super();

    this.state = {
      photoLabels: [],
      options: [],
      searchValue: '',
      addingLabel: false,
      detailIsVisible: false
    };
    this.clickInFlight = false;
    this.timer = null;

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.openDetailTimeout = null;
  }

  componentDidMount() {
    const { photo } = this.props;
    this.setState({ photoLabels: photo.labels ?? [] })
  }

  componentDidUpdate(prevProps) {
    const { photoLabels, options, searchValue } = this.state;
    const { photo, labels } = this.props
    const labelsEqual = (l1, l2) => l1.id === l2.id && l1.name === l2.name;

    if (prevProps.photo.name !== photo.name) {
      this.setState({ photoLabels: photo.labels });
    }

    if (options.length !== labels.length ||
      !options.every((l, i) => labelsEqual(l, labels[i]))) {
      const newPhotoLabels = photoLabels.map(label => {
        const latestLabel = labels.find(l => l.id === label.id);
        return latestLabel ? {...label, name: latestLabel.name} : label;
      });
      this.setState({ options: labels, photoLabels: newPhotoLabels });
    }
  }

  handleClick() {
    const { photo, onSelectPhoto } = this.props;
    if (this.clickInFlight) {
      clearTimeout(this.timer);
      this.handleDoubleClick();
      this.clickInFlight = false;
      return;
    }
    this.clickInFlight = true;
    this.timer = setTimeout(() => {
      onSelectPhoto(photo.id);
      this.clickInFlight = false;
    }, 230);
  }

  handleDoubleClick() {
    this.setState({ detailIsVisible: true });
  }

  handleSearch(query) {
    this.setState({ searchValue: query });
  }

  handleSelect(labelId) {
    const { photo, labels } = this.props;
    const label = labels.find(l => l.id === labelId);
    this.setState({ searchValue: label.name });
    const query = {
      photo: photo.id,
      label: label.id
    };
    const responseChannel = `response-photoLabels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, photoLabelresponse) => {
      const { photoLabels } = this.state;
      this.setState({
        addingLabel: false,
        photoLabels: photoLabels.concat([label]),
        searchValue: ''
      });
      message.success(`label ${label.name} added to ${photo.name}.${photo.file_type}`);
    });
    IPCRenderer.send('photoLabels-request', { url: 'CREATE', body: query, responseChannel });
  }

  handleRemove(label) {
    const { photo, labels } = this.props;
    const query = { photo: photo.id, label: label.id }
    const responseChannel = `response-photoLabels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (event, photoLabelresponse) => {
      const { photoLabels } = this.state;
      const newPhotoLabels = photoLabels.filter(plabel => plabel.id !== label.id);
      this.setState({ photoLabels: newPhotoLabels });
    });
    IPCRenderer.send('photoLabels-request', { url: 'DELETE', body: query, responseChannel });
  }

  render() {
    const { className, photo, labels, onDelete, isSelected, selectedLabelId, style } = this.props;
    const { addingLabel, detailIsVisible, photoLabels, searchValue } = this.state;
    if (!photo) { return null; }

    const { file_type, location, name } = photo;

    let labelToDisplay = null;
    if (selectedLabelId) {
      labelToDisplay = photoLabels.find(l => l.id === selectedLabelId);
    } else {
      labelToDisplay = photoLabels[0];
    }

    return (
      <div className={`clt-PhotoBlock ${className} ${isSelected ? 'clt-PhotoBlock--selected' : ''}`} style={style}>
        <div
          className='clt-PhotoBlock-container'
          onClick={this.handleClick}>
          { file_type === 'mp4' ?
          <video width='200' autoplay>
            <source src={`file://${location}`} type='video/mp4'></source>
          </video> :
          <img
            className='clt-PhotoBlock-image'
            src={`file://${location}`} />
          }
        </div>
        <div className='clt-PhotoBlock-tags'>
          <Modal
            title={`${name.toUpperCase()}`}
            mask={false}
            maskClosable={true}
            width={800}
            visible={detailIsVisible}
            onCancel={() => this.setState({ detailIsVisible: false })}
            onOk={() => this.setState({ detailIsVisible: false })}>
            <DetailPage
              photo={{ ...photo, labels: photoLabels }}
              labels={labels}
              onDelete={(photoId) => {  this.setState({ detailIsVisible: false }); onDelete(photoId)}}
              onRemove={this.handleRemove}
              onSelect={this.handleSelect}
            />
          </Modal>
        </div>
        <div className='clt-PhotoBlock-labels'>
          { labelToDisplay &&
            <Tag
              key={labelToDisplay.id}
              onClose={() => this.handleRemove(labelToDisplay)}
              closable>{labelToDisplay.name}</Tag>
          }
        </div>
      </div>
    );
  }
}

PhotoBlock.propTypes = {
  className: PropTypes.string,
  style: PropTypes.any,
  labels: PropTypes.arrayOf(PropTypes.object),
  selectedLabelId: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onSelectPhoto: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
}

export default PhotoBlock;


function searchOptions(query, options) {
  const queries = query.split(' ');
  return options.filter(option => {
    const hits = queries.map(q => option.name.indexOf(q) >= 0);
    return hits.some(h => h === true);
  });
}
