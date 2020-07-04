import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LabelService } from '../services/';

import './_index.scss';

class LeftPane extends Component {
  constructor() {
    super();

    this.state = {
      labels: []
    };
  }

  async componentDidMount() {
    const labels = await LabelService.search();
    this.setState({ labels });
  }


  render() {
    const { labels } = this.state;
    const { selectedLabel, onChange } = this.props;
    const types = ['photos', 'videos', 'types'];

    return (
      <div className='clt-LeftPane'>
        <div className='clt-LeftPane-list-container'>
          { labels.map(label =>
            <span
              key={label.id}
              className={`clt-LeftPane-item ${selectedLabel && label.id === selectedLabel.id ? 'clt-LeftPane--active' : ''}`}
              onClick={() => onChange(label)}>
              {label.name}
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
  selectedLabel: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  onChange: PropTypes.func
};

export default LeftPane;
