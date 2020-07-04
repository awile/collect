
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoBlock from './PhotoBlock';

import './_index.scss';

class Grid extends Component {
  constructor() {
    super();

    this.state = {
      photos: [111]
    };
  }

  componentDidMount() {
    this.getPhotos();
  }

  componentDidUpdate(prevProps) {
    const { selectedLabelId } = this.props;
    if (prevProps.selectedLabelId !== selectedLabelId) {
      this.getPhotos();
    }
  }

  async getPhotos() {
    const { selectedLabelId } = this.props;
    let query = {};
    if (selectedLabelId) {
      query.labels = [selectedLabelId];
    }
    const photos = [];
    this.setState({ photos });
  }

  render() {
    const { photos } = this.state;

    return (
      <div className='clt-Grid'>
        <div className='clt-Grid-container'>
          {
            photos.map(photo => <PhotoBlock />)
          }
        </div>
      </div>
    );
  }
}

Grid.propTypes = {
  selectedLabelId: PropTypes.string
}

export default Grid;
