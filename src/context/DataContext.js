import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { getDataByFeatures, getDataByFeaturesComplex, calculateStatisticsByCategory } from '../utils/Stats.js';
import { mySplice } from '../utils/ArrayUtils.js';
import {getColumnDTypes} from '../utils/DataFrameUtils.js'


const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [parsedResult, setParsedResult] = useState();
  const [parsedData, setParsedData] = useState([]);
  const [columnsFound, setColumnsFound] = useState([]);
  const [dataToAnalyze, setDataToAnalyze] = useState([]);
  const [preparedData, setPreparedData] = useState();
  const [figuresReady, setFiguresReady] = useState(false);
  const [statisticsReady, setStatisticsReady] = useState(false);
  const [uploadedFile, setUploadedFile] = useState();
  const [newFile, setNewFile] = useState(false);
  const [elements, setElements] = useState([]);
  const [finalColumns, setFinalColumns] = useState([]);
  const [finalColumnsStatus, setFinalColumnsStatus] = useState('');
  const [includedExcludedColumns, setIncludedExcludedColumns] = useState();
  const [outcome, setOutcome] = useState();
  const [columnMetadata, setColumnMetadata] = useState();
  const [showStatistics, setShowStatistics] = useState(false);
  const [skipFirstNLines, setSkipFirstNLines] = useState(0)
  useEffect(() => {
    if(newFile) {
      refreshContent();
    }
  }, [newFile])

  useEffect(() => {
    console.log(skipFirstNLines, uploadedFile)
    if(uploadedFile) {
      Papa.parse(uploadedFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        skipFirstNLines,
        complete: (result) => {
          handleDataParsed(result);
        },
      });
    }
  }, [uploadedFile, skipFirstNLines])

  const handleDataParsed = (parsedResult) => {
    setParsedResult(parsedResult);
    console.log(parsedResult.meta)
    const parsedColumns = parsedResult.meta?.fields;
    parsedColumns && setColumnsFound(parsedColumns);
    const parsedData = parsedResult.data;
    parsedData && setParsedData(parsedData);
  };

  const handleNull = (val) => {
    return (val === 'null') ? undefined : val
  }

  useEffect(() => {
    if(finalColumns.length > 0 && parsedData.length > 0) {
      const subset = parsedData.map((row) => {
        const newRow = {}
        finalColumns.forEach((key) => {
          const val = handleNull(row[key])
            newRow[key] = val
        });
        return newRow;
      })
      setDataToAnalyze(subset);
      setPreparedData({dataToAnalyze: subset, finalColumns});
    } else {
      setFinalColumnsStatus('');
    }
  }, [finalColumns])

  useEffect(() => {
    if(outcome && dataToAnalyze.length > 0 && finalColumns.length > 1) {
      const dataByFeatures = getDataByFeatures(dataToAnalyze, mySplice(finalColumns, outcome), outcome);
      const columnDataTypes = getColumnDTypes(dataByFeatures['Sample']);
      const columnMetadata = {}
      columnMetadata['fields'] = Array.from(Object.keys(columnDataTypes));
      columnMetadata['category'] = Object.keys(columnDataTypes).filter((feature) => columnDataTypes[feature] === 'CATEGORY');
      columnMetadata['category_doubt'] = Object.keys(columnDataTypes).filter((feature) => columnDataTypes[feature] === 'CATEGORY_DOUBT');
      columnMetadata['numeric'] = Object.keys(columnDataTypes).filter((feature) => columnDataTypes[feature] === 'NUMERIC');
      columnMetadata['userValidated'] = false;
      setColumnMetadata(columnMetadata);

      setPreparedData({...preparedData, outcome, columnMetadata})
      // setDataTypesValidated(false);
      } 
  }, [outcome])

  const onValidateDataTypes = (wordsBySection) => {
    console.log(wordsBySection)
    const numeric = wordsBySection[0].map(({word}) => word);
    const category = wordsBySection[1].map(({word}) => word);
    const columnMetadataValidated = {
      numeric, 
      category,
      category_doubt: [],
      fields: [...numeric, ...category],
      userValidated: true
    } 
    setColumnMetadata(columnMetadataValidated);

    // setExpanded(false);
    const preparedDataCurr = {...preparedData}
    setPreparedData({...preparedDataCurr, columnMetadata: columnMetadataValidated}); 
    if(outcome && dataToAnalyze.length > 0) {
      // const dataByFeaturesComplex = getDataByFeaturesComplex(dataToAnalyze, columnMetadata, outcome)
      // setDataByFeatureRows(dataByFeaturesComplex);
      // if(dataToAnalyze.length > 0 || dataByFeaturesComplex) {
      setShowStatistics(true);
      setFiguresReady(true)
    }
  }

  const refreshContent = () => {
    setOutcome();
    setIncludedExcludedColumns();
    setFinalColumns([]);
    setColumnMetadata();
    setShowStatistics(false);
    setFiguresReady(false);
    if(parsedResult) {
      handleDataParsed(parsedResult);
    }
  }




  return (
    <DataContext.Provider value={
      { preparedData, setPreparedData, 
      figuresReady, setFiguresReady, 
      statisticsReady, setStatisticsReady, 
      uploadedFile, setUploadedFile,
      newFile, setNewFile,
      columnsFound, setColumnsFound,
      elements, setElements,
      finalColumns, setFinalColumns,
      finalColumnsStatus, setFinalColumnsStatus,
      includedExcludedColumns, setIncludedExcludedColumns,
      dataToAnalyze, refreshContent,
      outcome, setOutcome,
      columnMetadata, setColumnMetadata,
      onValidateDataTypes, showStatistics, setShowStatistics,
      skipFirstNLines, setSkipFirstNLines
       }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };