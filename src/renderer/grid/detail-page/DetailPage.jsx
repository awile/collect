import React from 'react';
import PropTypes from 'prop-types';

import { Col, Layout, Row, Tag } from 'antd';

import './_detail-page.scss';

class DetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { photo } = this.props;
    const { location } = photo;
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
                <div className='clt-DetailPage-labels-current'>
                  { photo.labels &&
                      photo.labels.map(l =>
                        <Tag
                          key={l.id}>
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
          </div>
        </div>
      </div>
    );
  }
}

DetailPage.propTypes = {
  photo: PropTypes.object
};

export default DetailPage;
