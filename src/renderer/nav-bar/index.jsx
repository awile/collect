import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input, Layout } from 'antd';

const { Header, Content, Sider } = Layout;
const { Search } = Input;

import './_nav-bar.scss';

class NavBar extends Component {
  constructor() {
    super();

    this.state = {
      options: [],
      value: ''
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.ref = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { labels } = this.props;
    if (prevProps.labels.length !== labels.length) {

      this.setState({ options: labels.map(l => ({ label: l.name, value: l.name, id: l.id })) });
    }
  }

  handleSearch(value) {
    const { labels } = this.props;
    const { options } = this.state;
    const filterOptions = labels
      .filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) >= 0)
      .map(l => ({ label: l.name, value: l.name, id: l.id }));
    this.setState({ options: filterOptions, value });
  }

  handleSelect(label, option) {
    const { labels, onChange } = this.props;
    if (onChange) {
      const label = labels.find(l => l.id === option.id);
      onChange(label);
    }
    this.setState({
      options: labels.map(l => ({ label: l.name, value: l.name, id: l.id })),
      value: ''
    });
    if (this.ref) {
      this.ref.current.blur();
    }
  }

  render() {
    const { onChange, selectedLabelName } = this.props;
    const { options, value } = this.state;

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
        <AutoComplete
          className='clt-NavBar-search-bar'
          dropdownMatchSelectWidth={252}
          style={{ width: 300 }}
          options={options}
          value={value}
          onSelect={this.handleSelect}
          onChange={this.handleSearch}>
          <Search
            ref={this.ref}
            allowClear
            className='clt-NavBar-search-input'
            placeholder='search'
            style={{ width: 325 }}
            value={value}
            size='small' />
        </AutoComplete>
      </Header>
    );
  }
}

NavBar.propTypes = {
  label: PropTypes.arrayOf(PropTypes.object),
  selectedLabelName: PropTypes.string,
  onChange: PropTypes.func
};

export default NavBar;
