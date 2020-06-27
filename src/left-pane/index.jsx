import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_index.scss';

class LeftPane extends Component {

  render() {
    const { text, onChange } = this.props;
    const types = ['photos', 'videos', 'types'];

    return (
      <div className='clt-LeftPane'>
        <div className='clt-LeftPane-list-container'>
          { types.map(type =>
            <span
              key={type}
              className={`clt-LeftPane-item ${type === text ? 'clt-LeftPane--active' : ''}`}
              onClick={() => onChange(type)}>
              {type}
            </span>)
          }
          <hr />
          <span className='clt-LeftPane-item' onClick={() => onChange('')}>clear</span>
        </div>
      </div>
    );
  }
}

LeftPane.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func
};

export default LeftPane;
