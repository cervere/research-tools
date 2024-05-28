// Component FeatureSelect
import React from 'react';
import WordSelector from './WordSelector.js';
import TextField from '@mui/material/TextField';


const FeatureSelect = ({ includedExcludedColumns, columnsFound, onFinalize, setSkipFirstNLines}) => {

  return (
    <div>
    <TextField 
    placeholder='Skip N lines for header'
    onChange={(e) => {
      const inp = Number(e.target.value)
      setSkipFirstNLines(inp || 0)
    }}
    />
    <WordSelector 
      words={[
        {
          label: "Inclusion", 
          words: includedExcludedColumns ? includedExcludedColumns[0] : columnsFound.slice(0,20).map((word) => ({word}))
        },  
        {
          label: "Exclusion",
          words: includedExcludedColumns ? includedExcludedColumns[1] : columnsFound.slice(20).map((word) => ({word}))
        }
      ]}
      onFinalize={onFinalize}
      actionLabel="Confirm Selection"
      includeAllBtn
    />
    </div>
  );
}

export default FeatureSelect;