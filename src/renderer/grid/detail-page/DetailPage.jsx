import React from 'react';
import PropTypes from 'prop-types';

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
          <img className='clt-DetailPage-image' src={`file://${location}`} />
        </div>
      </div>
    );
  }
}

DetailPage.propTypes = {
  photo: PropTypes.object
};

export default DetailPage;
