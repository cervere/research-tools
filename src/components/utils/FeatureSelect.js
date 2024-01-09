// Component FeatureSelect
import React from 'react';
import WordSelector from './WordSelector.js';

const FeatureSelect = ({ includedExcludedColumns, columnsFound, onFinalize }) => {

  return (
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
    />
  );
}

export default FeatureSelect;