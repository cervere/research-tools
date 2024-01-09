import React, {useState, useEffect, useContext} from 'react';
import { DataContext } from '../context/DataContext.js';
import BoxPlot from './viz/BoxPlot';

const Figures = () => {
    const { preparedData, setPreparedData, 
        figuresReady, setFiguresReady, 
        statisticsReady, setStatisticsReady } = useContext(DataContext);
    const {columnMetadata, dataToAnalyze, outcome} = preparedData;

    // console.log(dataToAnalyze[0])
    // console.log(outcome)
    const dataField = 'ADASTS11_DIFF';
    const subgroupField = 'PTGENDER'
    const APOE_MAPPING = ['APOE Absent', 'APOE Present']
    return (
        <BoxPlot data={
            dataToAnalyze.filter((row) => ((row[outcome] || row[outcome] === 0) && row[dataField] ))
            // .map((row) => ({group: row[outcome], subgroup: row[subgroupField], value: row[dataField]}))
            .map((row) => ({group: row[outcome], value: row[dataField]}))
        } 
        />    
        );
};

export default Figures;