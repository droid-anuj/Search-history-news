import React, { useState } from "react";
import Logo from '../../Assets/logo.png'
import "./SearchHeader.css";

const SearchHeader = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="SearchHeader">
      <img src={Logo} alt="logo" className="logo" />
      <div className="searchtitle">
        <span>Search<br /> Hacker News</span>
      </div>
      <div className="search">
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search Hacker News"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <div className="search-text" onClick={handleSearch}>Search</div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
