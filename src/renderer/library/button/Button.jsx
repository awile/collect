import React from 'react';
import PropTypes from 'prop-types';

import './_button.scss';

class Button extends React.Component {

  render() {
    const { className, children, onClick } = this.props;

    return (
      <div className={`lib-Button ${className ?? ''}`} onClick={onClick}>
        <span className='lib-Button-label'>
          {children}
        </span>
      </div>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default Button;
