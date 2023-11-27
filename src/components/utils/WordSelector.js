import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

const WordSelector = ({ words, onFinalize, actionLabel }) => {
  const [includedWords, setIncludedWords] = useState();
  const [excludedWords, setExcludedWords] = useState();

  useEffect(() => {
    setIncludedWords(words[0].words);
    setExcludedWords(words[1].words);
  }, words)

  const handleIncludeWord = (wordObj) => {
    if (includedWords.length < 20) {
      const updatedIncluded = [...includedWords, wordObj];
      setIncludedWords(updatedIncluded);
      const updatedExcluded = excludedWords.filter((w) => w.word !== wordObj.word);
      setExcludedWords(updatedExcluded);
    }
  };

  const handleExcludeWord = (wordObj) => {
    const updatedExcluded = [...excludedWords, wordObj];
    setExcludedWords(updatedExcluded);
    const updatedIncluded = includedWords.filter((w) => w.word !== wordObj.word);
    setIncludedWords(updatedIncluded.slice(0, 20));
  };

  const wordStyle = {
    padding: '5px',
    margin: '5px',
    display: 'inline-block',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
      <div style={{ width: '100%', marginBottom: '20px' }}>
      <Button sx={{margin: "10px"}} 
        onClick={() => {
          onFinalize([includedWords, excludedWords]);
        }} 
        variant="contained" color="primary"> 
        {actionLabel} 
      </Button>
        <h3>{words[0].label} {includedWords && `(${includedWords.length})`} </h3>
        <div style={{ width: '100%', border: '1px solid #ccc', padding: '10px' }}>
          {includedWords?.map((wordObj, index) => (
            <span
              key={index}
              style={wordStyle}
              onClick={() => handleExcludeWord(wordObj)}
            >
              {wordObj.word}
            </span>
          ))}
        </div>
      </div>
      {
      excludedWords?.length > 0 &&
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <h3>{words[1].label} {excludedWords && `(${excludedWords.length})`} </h3>
        <div style={{ width: '100%', border: '1px solid #ccc', padding: '10px' }}>
          {excludedWords.map((wordObj, index) => (
            <span
              key={index}
              style={wordObj.style ? ({...wordStyle, ...wordObj.style}) : wordStyle}
              onClick={() => handleIncludeWord(wordObj)}
            >
              {wordObj.word}
            </span>
          ))}
        </div>
      </div>
      }
    </div>
  );
};


export default WordSelector;
