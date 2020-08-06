import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input, Layout } from 'antd';

const { Header } = Layout;
const { Search } = Input;

import './_nav-bar.scss';

function NavBar({ labels, selectedLabelName, onChange }) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');
  const searchInputRef = useRef();

  const makeOptions = (labels) => labels.map(l => ({ label: l.name, value: l.name, id: l.id }));
  if (!options.every(o => labels.findIndex(l => l.id === o.id) >= 0)) {
    const newOptions = makeOptions(labels);
    setOptions(newOptions);
  }

  const handleSearch = (value) => {
    const filterOptions = makeOptions(labels
      .filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) >= 0))
    setValue(value);
    setOptions(filterOptions);
  }

  const handleSelect = (_, option) => {
    if (onChange) {
      const label = labels.find(l => l.id === option.id);
      onChange(label);
    }
    setValue('');
    setOptions(makeOptions(labels));
    searchInputRef.current.blur();
  };

  return (
    <Header className='clt-NavBar'>
      <div className='clt-NavBar-container'>
        <span className='clt-NavBar-title'>COLLECT</span>
        { selectedLabelName && (
          <React.Fragment>
            <span className='clt-NavBar-divider'>{'>'}</span>
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
        onSelect={handleSelect}
        onChange={handleSearch}>
        <Search
          ref={searchInputRef}
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

NavBar.propTypes = {
  label: PropTypes.arrayOf(PropTypes.object),
  selectedLabelName: PropTypes.string,
  onChange: PropTypes.func
};

export default NavBar;
