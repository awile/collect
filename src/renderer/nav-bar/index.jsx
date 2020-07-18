import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

import './_nav-bar.scss';

class NavBar extends Component {
  render() {
    const { selectedLabelName } = this.props;

    return (
      <Header className='clt-NavBar'>
        <div className='clt-NavBar-container'>
          <span className='clt-NavBar-title'>1-800-COLLECT</span>
          { selectedLabelName && (
            <React.Fragment>
              <span className='clt-NavBar-divider'>></span>
              <span className='clt-NavBar-current'>{selectedLabelName}</span>
            </React.Fragment>
          )}
        </div>
      </Header>
    );
  }
}

NavBar.propTypes = {
  selectedLabelName: PropTypes.string
};

export default NavBar;
