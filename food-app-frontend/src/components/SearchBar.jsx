import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search dishes..."
    value={value}
    onChange={onChange}
  />
);

export default SearchBar; 