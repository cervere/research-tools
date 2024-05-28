import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import FilterInputComponent from './FilterInputComponent';

const WordSelector = ({ words, onFinalize, actionLabel, includeAllBtn }) => {
  const [includedWords, setIncludedWords] = useState();
  const [excludedWords, setExcludedWords] = useState();
  const [excludeFilterInput, setExcludeFilterInput] = React.useState();
  const [includeFilterInput, setIncludeFilterInput] = React.useState();

  const handleAddAllExclude = () => {
    if(excludeFilterInput && excludedWords) {
      const filteredWords = excludedWords.filter((wordObj) => wordObj.word.toLowerCase().indexOf(excludeFilterInput.toLowerCase()) > -1);
      handleIncludeWord(filteredWords);
      setExcludeFilterInput('');
    }
  }

  const handleAddAllInclude = () => {
    if(includeFilterInput && includedWords) {
      const filteredWords = includedWords.filter((wordObj) => wordObj.word.toLowerCase().indexOf(includeFilterInput.toLowerCase()) > -1);
      handleExcludeWord(filteredWords);
      setIncludeFilterInput('');
    }
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onExcludeFilterInput = (event) => {
    setExcludeFilterInput(event.target.value)
  }

  const onIncludeFilterInput = (event) => {
    setIncludeFilterInput(event.target.value)
  }

  useEffect(() => {
    setIncludedWords(words[0].words);
    setExcludedWords(words[1].words);
  }, words)

  const handleIncludeWord = (wordObjs) => {
    // if (includedWords.length < 20) {
      const updatedIncluded = [...includedWords, ...wordObjs];
      setIncludedWords(updatedIncluded);
      const updatedExcluded = excludedWords.filter((w) => !wordObjs.find((wordObj) => wordObj.word === w.word));
      setExcludedWords(updatedExcluded);
    // }
  };

  const handleExcludeWord = (wordObjs) => {
    const updatedExcluded = [...excludedWords, ...wordObjs];
    setExcludedWords(updatedExcluded);
    const updatedIncluded = includedWords.filter((w) => !wordObjs.find((wordObj) => wordObj.word === w.word));
    setIncludedWords(updatedIncluded.slice());
    // setIncludedWords(updatedIncluded.slice(0, 20));
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
      {includeAllBtn && excludedWords?.length > 0 && 
            <Button sx={{margin: "10px"}} 
            onClick={() => {
              onFinalize([[...includedWords, ...excludedWords], []]);
            }} 
            variant="contained" color="primary"> 
            Include All 
          </Button>
      }
        <h3>{words[0].label} {includedWords && `(${includedWords.length})`} </h3>
        <FilterInputComponent 
        filterInput={includeFilterInput}
        onFilterInput={onIncludeFilterInput}
        handleAddAll={handleAddAllInclude}
        handleMouseDownPassword={handleMouseDownPassword}
        role="Exclude"
        />
        <div style={{ width: '100%', border: '1px solid #ccc', padding: '10px' }}>
          {includedWords && (includeFilterInput? includedWords.filter((wordObj) => wordObj.word.toLowerCase().indexOf(includeFilterInput.toLowerCase()) > -1) : includedWords).map((wordObj, index) => (
            <span
              key={index}
              style={wordStyle}
              onClick={() => handleExcludeWord([wordObj])}
            >
              {wordObj.word}
            </span>
          ))}
        </div>
      </div>
      {
      // excludedWords?.length > 0 &&
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <h3>{words[1].label} {excludedWords && `(${excludedWords.length})`} </h3>
        <FilterInputComponent 
        filterInput={excludeFilterInput}
        onFilterInput={onExcludeFilterInput}
        handleAddAll={handleAddAllExclude}
        handleMouseDownPassword={handleMouseDownPassword}
        role="Include"
        />
       <div style={{ width: '100%', border: '1px solid #ccc', padding: '10px' }}>
          {excludedWords && (excludeFilterInput ? excludedWords.filter((wordObj) => wordObj.word.toLowerCase().indexOf(excludeFilterInput.toLowerCase()) > -1) : excludedWords).map((wordObj, index) => (
            <span
              key={index}
              style={wordObj.style ? ({...wordStyle, ...wordObj.style}) : wordStyle}
              onClick={() => handleIncludeWord([wordObj])}
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
