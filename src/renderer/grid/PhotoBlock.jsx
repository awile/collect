
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { IPCRenderer } from '../ipc';
import { Select, Tag, Input, Tooltip, Popconfirm } from 'antd';
const { Option } = Select;
import { CloseOutlined } from '@ant-design/icons';

import './_photo-block.scss';

class PhotoBlock extends Component {
  constructor() {
    super();

    this.state = {
      photoLabels: [],
      options: [],
      searchValue: ''
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
    const { options, searchValue } = this.state;
    const { labels } = this.props
    if (labels && !(options.length === labels.length ||
        labels.map((o, i) => options[i] && o.id === options[i].id))) {
      this.setState({ options: labels });
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
      this.setState({ photoLabels: photoLabels.concat([label]), searchValue: '' });
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
    const { photo, labels } = this.props;
    const { photoLabels, searchValue } = this.state;
    if (!photo) { return null; }

    const { location, file_type } = photo;

    return (
      <div className='clt-PhotoBlock'>
        <div className='clt-PhotoBlock-container'>
          { file_type === 'mp4' ?
          <video width='130' height='130' autoplay>
            <source src={`file://${location}`} type='video/mp4'></source>
          </video> :
          <img
            width='130'
            height='130'
            src={`file://${location}`} />
          }
          <div className='clt-PhotoBlock-tags'>
            { photoLabels.map(label =>
              <Tag
                key={label.id}
                onClose={() => this.handleRemove(label)}
                closable>{label.name}</Tag>)}
            <Select
              showSearch
              style={{ width: 100 }}
              placeholder="add a label"
              value={searchValue}
              onSelect={this.handleSelect}
              onSearch={this.handleSearch}>
              {searchOptions(searchValue, labels.filter(l => !photoLabels.map(p => p.id).includes(l.id))).map(l =>
                <Option key={l.id} value={l.id}>{l.name}</Option>)}
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

PhotoBlock.propTypes = {
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
