import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import './style.scss';
import { useSelector } from 'react-redux';

const SearchBox = ({ onFilter }) => {
  const [price, setPrice] = useState(100); // Default max price
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useSelector((state) => state.categories.categories);

  // Handle price change
  const handlePriceChange = (e, newValue) => {
    setPrice(newValue);
    applyFilters({ price: newValue, title, category });
  };

  // Handle title (product name) input change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    applyFilters({ price, title: e.target.value, category });
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    applyFilters({ price, title, category: e.target.value });
  };

  // Apply filters 
  const applyFilters = (filters) => {
    onFilter(filters); // Call the parent function to filter products
  };

  // clear ALL filters
  const clearFilters = () => {
    setPrice(100);
    setTitle('');
    setCategory('All');
    applyFilters({ price: 100, title: '', category: 'All' });
  };

  return (
    <div className="search-container" style={{ backgroundColor: 'lightgray', padding: '10px 20px', borderRadius: '8px', width: '90%', margin: '20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label>Filtered By Category:</label>
      <select value={category} onChange={handleCategoryChange} style={{ margin: '0 15px', padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc' }}>
        <option value="All">All</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>

      <Box sx={{ width: '250px' }}>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
          <label>Price:</label>
          <Slider
            value={price}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            step={10}
            valueLabelFormat={(value) => `$${value}`}
          />
          <span>{`$${price}`}</span>
        </Stack>
      </Box>

      <label>Title:</label>
      <input type="text" value={title} onChange={handleTitleChange} style={{ margin: '0 15px', padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', width: '150px' }} />

      <button onClick={clearFilters} style={{ padding: '8px 20px', marginLeft: '15px', borderRadius: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s ease, border 0.3s ease' }}
        onMouseEnter={(e) => { e.target.style.backgroundColor = '#0056b3'; e.target.style.border = '1px solid #0056b3'; }}
        onMouseLeave={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.border = 'none'; }}>
        Clear
      </button>
    </div>
  );
};

export default SearchBox;
