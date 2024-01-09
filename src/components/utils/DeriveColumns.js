import React, { useState } from 'react';
import SingleTransformation from './SingleTransformation';

const DeriveColumns = ({ data }) => {
  const {columnMetadata, dataToAnalyze, outcome, finalColumns} = data;
  const [newField, setNewField] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [comparisonOperator, setComparisonOperator] = useState('');

  const handleAddNewField = () => {
    // Add logic to handle adding new field
  };

  const handleAddCategory = () => {
    // Add logic to handle adding category
  };

  return (
    <SingleTransformation 
    options={finalColumns}
    />
  );
};

export default DeriveColumns;