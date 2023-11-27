import React, { useState } from 'react';
import mammoth from 'mammoth';

const WordDocumentConverter = () => {
  const [htmlContent, setHtmlContent] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const { value } = await mammoth.convertToHtml({ arrayBuffer: file });
        setHtmlContent(value);
      } catch (error) {
        console.error('Error converting Word document:', error);
        setHtmlContent('Error: Unable to convert the document.');
      }
    }
  };

  return (
    <div>
      <h2>Word Document Converter</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <div className="converted-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default WordDocumentConverter;
