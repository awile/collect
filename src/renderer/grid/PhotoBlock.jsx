
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_photo-block.scss';

class PhotoBlock extends Component {

  render() {

    return (
      <div className='clt-PhotoBlock'>
        <div className='clt-PhotoBlock-container'>
          <img width='130' height='130' src='https://www.bronze56k.com/nav/BRONZE_3D_600x_LOGO_1.gif' />
        </div>
      </div>
    );
  }
}

export default PhotoBlock;
