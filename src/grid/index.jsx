
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './PhotoBlock';

import './_index.scss';

class Grid extends Component {

  render() {
    const { text } = this.props;
    const photos = new Array(20).fill(1);

    return (
      <div className='clt-Grid'>
        <div className='clt-Grid-container'>
          {
            photos.map(photo =>
              <PhotoBlock />)
          }
        </div>
      </div>
    );
  }
}

Grid.propTypes = {
  text: PropTypes.string
}

export default Grid;
