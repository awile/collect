import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IPCRenderer } from '../../ipc';
import moment from 'moment';

import { message, Button, Col, Popconfirm, Row, Select, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import CreatableSelect from 'react-select/creatable';

import './_detail-page.scss';

function DetailPage({ photoId, setLabels, labels, onRemove, onDelete}) {
  const [photo, setPhoto] = useState(null);
  const [selectValue, _] = useState([]);

  useEffect(() => {
    if (photo === null) {
      loadPhoto();
    }
  });

  const loadPhoto = () => {
    const responseChannel = `response-download-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, (_, photo) => {
      setPhoto(photo);
    });
    IPCRenderer.send('photos-request', { url: 'GET', body: { photoId: photoId }, responseChannel });
  }

  const downloadPhoto = () => {
    const responseChannel = `response-download-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, () => {
      message.success(`${photo.name}.${photo.file_type} downloaded`);
    });
    IPCRenderer.send('photos-request', { url: 'DOWNLOAD', body: { photo: photo.id }, responseChannel });
  };
  const createPromise = (labelsToCreate) => new Promise((resolve) => {
    let labelsCreated = 0;
    let newLabelValues = [];
    labelsToCreate.forEach((l, i) => {
      const responseChannel = `response-labels-${moment().toISOString()}-${i}`;
      IPCRenderer.once(responseChannel, (_, label) => {
        labelsCreated += 1;
        newLabelValues.push(label);
        if (labelsCreated === labelsToCreate.length) {
          message.success(`${labelsToCreate.length} labels created`);
          setLabels(labels.concat(newLabelValues));
          resolve(newLabelValues);
        }
      });
      const body = { name: l.value };
      IPCRenderer.send('labels-request', { url: 'CREATE', body, responseChannel });
    });
  });
  const applyLabels = (labelsToApply) => {
    const query = {
      photos: [photo.id],
      labels: labelsToApply
    };
    const responseChannel = `response-photoLabels-${moment().toISOString()}`;
    IPCRenderer.once(responseChannel, () => {
      loadPhoto();
    });
    IPCRenderer.send('photoLabels-request', { url: 'CREATE_BULK', body: query, responseChannel });
  };
  const handleChange = async (selectedLabels, action) => {
    if (action.action === 'create-option') {
      const newLabels = await createPromise(selectedLabels);
      applyLabels(newLabels.map(l => l.id));
    } else {
      applyLabels(selectedLabels.map(l =>  l.value));
    }
  };

  if (!photo) { return null; }

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
                  <CreatableSelect
                    isClearable
                    isMulti
                    value={selectValue}
                    name="create labels"
                    className="clt-DetailPage-add-labels"
                    classNamePrefix="select"
                    placeholder='add a label...'
                    options={dropdownOptions.map(o => ({ label: o.name, value: o.id }))}
                    onChange={handleChange}
                    styles={selectStyles}
                  />
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
                  title='Are you sure you want to delete this photo?'
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
  photoId: PropTypes.string,
  labels: PropTypes.array,
  onRemove: PropTypes.func,
  onDelete: PropTypes.func
};

export default DetailPage;

const selectHeight = 28;
const selectStyles = {
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
};
