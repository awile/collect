
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { IPCRenderer } from '../../ipc';
import {
  Button,
  Input,
  Modal,
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

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    const { photo } = this.props;
    this.setState({ photoLabels: photo.labels ?? [] })
  }

  componentDidUpdate() {
    const { photoLabels, options, searchValue } = this.state;
    const { photo, labels } = this.props
    const labelsEqual = (l1, l2) => l1.id === l2.id && l1.name === l2.name;

    if (options.length !== labels.length ||
      !options.every((l, i) => labelsEqual(l, labels[i]))) {
      const newPhotoLabels = photoLabels.map(label => {
        const latestLabel = labels.find(l => l.id === label.id);
        return latestLabel ? {...label, name: latestLabel.name} : label;
      });
      this.setState({ options: labels, photoLabels: newPhotoLabels });
    }
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
    const { className, photo, labels, selectedLabelId, style } = this.props;
    const { addingLabel, detailIsVisible, photoLabels, searchValue } = this.state;
    if (!photo) { return null; }

    const { file_type, location, name } = photo;
    const photoLabelIds = photoLabels.map(p => p.id);

    let labelToDisplayId = photoLabelIds[0];
    if (photoLabelIds.includes(selectedLabelId)) {
      labelToDisplayId = selectedLabelId;
    }
    const labelToDisplay = labelToDisplayId ? labels.find(l => l.id === labelToDisplayId) : null;
    const photoLabelsNotAdded = labels.filter(l => !photoLabelIds.includes(l.id));
    const dropdownOptions = searchOptions(searchValue, photoLabelsNotAdded);

    return (
      <div className={`clt-PhotoBlock ${className}`} style={style}>
        <div className='clt-PhotoBlock-container'>
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
          <Button
            className='clt-PhotoBlock-detail-btn'
            size='small'
            icon={<ProfileOutlined />}
            onClick={() => this.setState({ detailIsVisible: true })} />
          <Modal
            title={`${name.toUpperCase()}`}
            mask={false}
            maskClosable={true}
            width={800}
            visible={detailIsVisible}
            onCancel={() => this.setState({ detailIsVisible: false })}
            onOk={() => this.setState({ detailIsVisible: false })}>
            <DetailPage photo={photo} />
          </Modal>
          { addingLabel ?
            <Select
              autoFocus
              defaultOpen
              showSearch
              bordered={false}
              style={{ width: 100 }}
              placeholder="add a label"
              onBlur={() => this.setState({ addingLabel: false })}
              filterOption={() => true}
              value={searchValue}
              size='small'
              onSelect={this.handleSelect}
              onSearch={this.handleSearch}>
              {
                dropdownOptions.map(l => <Option key={l.id} value={l.id}>{l.name}</Option>)
              }
            </Select> :
            <Button
              size='small'
              icon={<PlusOutlined />}
              onClick={() => this.setState({ addingLabel: true })} />
          }
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
  labels: PropTypes.arrayOf(PropTypes.object)
}

export default PhotoBlock;


function searchOptions(query, options) {
  const queries = query.split(' ');
  return options.filter(option => {
    const hits = queries.map(q => option.name.indexOf(q) >= 0);
    return hits.some(h => h === true);
  });
}
