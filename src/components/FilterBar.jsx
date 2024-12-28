import React from 'react';
import { motion } from 'framer-motion';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex gap-4 p-4 bg-white shadow-md rounded-lg"
    >
      <TextField
        label="Search Claims"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        size="small"
      />
      <FormControl size="small" style={{ minWidth: 120 }}>
        <InputLabel>Rating</InputLabel>
        <Select
          value={filters.rating}
          label="Rating"
          onChange={(e) => onFilterChange('rating', e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
          <MenuItem value="mixed">Mixed</MenuItem>
        </Select>
      </FormControl>
    </motion.div>
  );
};

export default FilterBar;