import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../../ipc';
import moment from 'moment';

import { message, Button, Col, Popconfirm, Row, Select, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import './_detail-page.scss';

function DetailPage({ labels, photo, onRemove, onDelete, onSelect }) {
  const [searchValue, setSearchValue] = useState('');

  const downloadPhoto = () => {
    const responseChannel = `response-download-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, () => {
      message.success(`${photo.name}.${photo.file_type} downloaded`);
    });
    IPCRenderer.send('photos-request', { url: 'DOWNLOAD', body: { photo: photo.id }, responseChannel });
  };

  const { location } = photo;
  const labelIds = (photo.labels ?? []).map(l => l.id);
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
                    filterOption={(query, option) => option.children.indexOf(query)  >= 0 }
                    value={searchValue}
                    size='small'
                    onSelect={onSelect}
                    onSearch={query => setSearchValue(query)}>
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
                  onClick={downloadPhoto}>
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

DetailPage.propTypes = {
  photo: PropTypes.object,
  labels: PropTypes.array,
  onRemove: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func
};

export default DetailPage;
