
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_photo-block.scss';

class PhotoBlock extends Component {

  render() {
    const { photo } = this.props;
    if (!photo) { return null; }

    const { data } = photo;

    return (
      <div className='clt-PhotoBlock'>
        <div className='clt-PhotoBlock-container'>
          <img
            width='130'
            height='130'
            src={data} />
        </div>
      </div>
    );
  }
}

export default PhotoBlock;
