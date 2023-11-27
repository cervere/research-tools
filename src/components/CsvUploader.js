// CsvUploader.js
import React, { useState } from 'react';
import Papa from 'papaparse';

function CsvUploader({ onDataParsed }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        console.log(result.meta);
        onDataParsed(result);
      },
    });
  };

  return (
    <input type="file" accept=".csv" onChange={handleFileUpload} />
  );
}

export default CsvUploader;
