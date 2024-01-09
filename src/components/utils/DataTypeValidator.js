import React from 'react';
import WordSelector from './WordSelector';

const DataTypeValidator = ({ columnMetadata, onUpdateDataTypes }) => {
  return (
    <WordSelector 
      words={[
        {label: "Numerical", words: columnMetadata.numeric.map((word) => ({word}))}, 
        {
          label: `Categorical`, 
          words: [
            ...columnMetadata.category.map((word) => ({word})),
            ...(columnMetadata.category_doubt.map((word) => ({word, style: {backgroundColor: '#FFF44F'}})))
          ]
        }
      ]}
      onFinalize={onUpdateDataTypes}
      actionLabel="Validate"
    />
  );
}

export default DataTypeValidator;