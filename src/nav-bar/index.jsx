import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './_nav-bar.scss';

class NavBar extends Component {
  render() {
    const { text } = this.props;

    return (
      <div className='clt-NavBar'>
        <div className='clt-NavBar-container'>
          <span className='clt-NavBar-title'>1-800-COLLECT</span>
          { text && (
            <React.Fragment>
              <span className='clt-NavBar-divider'>></span>
              <span className='clt-NavBar-current'>{text}</span>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

NavBar.propTypes = {
  text: PropTypes.string
};

export default NavBar;
