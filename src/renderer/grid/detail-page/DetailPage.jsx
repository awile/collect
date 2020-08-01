import React from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../../ipc';
import moment from 'moment';

import { message, Button, Col, Popconfirm, Layout, Row, Select, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import './_detail-page.scss';

class DetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: ''
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.downloadPhoto = this.downloadPhoto.bind(this);
  }

  handleSearch(query) {
    this.setState({ searchValue: query })
  }

  downloadPhoto() {
    const { photo } = this.props;
    const responseChannel = `response-download-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, () => {
      message.success(`${photo.name}.${photo.file_type} downloaded`);
    });
    IPCRenderer.send('photos-request', { url: 'DOWNLOAD', body: { photo: photo.id }, responseChannel });
  }

  render() {
    const { labels, onDelete, onSelect, onRemove, photo } = this.props;
    const { location } = photo;
    const { searchValue } = this.state;
    const labelIds = photo.labels.map(l => l.id);
    const dropdownOptions = labels.filter(l => !labelIds.includes(l.id));

    return (
      <div className='clt-DetailPage'>
        <div className='clt-DetailPage-container'>
          <div className='clt-DetailPage-left'>
            <img className='clt-DetailPage-image' src={`file://${location}`} />
          </div>
          <div className='clt-DetailPage-right'>
            <Row>
              <Col className='clt-DetailPage-labels'>
                <h2>Labels</h2>
                <div className='clt-DetailPage-labels-add'>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    placeholder="add a label"
                    filterOption={(query, option) => option.indexOf(query) >= 0}
                    value={searchValue}
                    size='small'
                    onSelect={onSelect}
                    onSearch={this.handleSearch}>
                    { dropdownOptions.map(l => <Option key={l.id} value={l.id}>{l.name}</Option>) }
                  </Select>
                </div>
                <div className='clt-DetailPage-labels-current'>
                  { photo.labels &&
                      photo.labels.map(l =>
                        <Tag
                          key={l.id}
                          onClose={() => onRemove(l)}
                          closable>
                          {l.name}
                        </Tag>)
                  }
                </div>
              </Col>
            </Row>
            <Row>
              <Col className='clt-DetailPage-file-type'>
                <h2>File Type</h2>
                <span>{photo.file_type.toUpperCase()}</span>
              </Col>
            </Row>
            <Row className='clt-DetailPage-delete-row'>
              <Col>
                <Button
                  icon={<DownloadOutlined />}
                  size='small'
                  onClick={this.downloadPhoto}>
                  Download
                </Button>
                <Popconfirm
                  placement='top'
                  title='Are you sure you want to delete this photo'
                  onConfirm={() => onDelete(photo.id)}
                  okText='Delete'
                  cancelText='Cancel'>
                  <Button
                    type='danger'
                    size='small'>
                    Delete
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

DetailPage.propTypes = {
  photo: PropTypes.object,
  onRemove: PropTypes.func,
  onDelete: PropTypes.func
};

export default DetailPage;
