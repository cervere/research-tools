import { useState, useRef, useContext, useEffect } from "react";
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';
import { NivoRadar } from "./NivoRadar";
import { DataContext } from "../../../context/DataContext";
import CheckboxPanel from "../../utils/CheckboxPanel";


const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 50;

const mean = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;


export const RadarPlotContainer = ({ width = 800, height = 800 }) => {

  const {preparedData, showStatistics} = useContext(DataContext);
  const [mirrorPosition, setMirrorPosition] = useState(0.6);
  const [smoothing, setSmoothing] = useState(true);
  const divRef = useRef(null);
  const [radarData, setRadarData] = useState()
  const [radarDataMean, setRadarDataMean] = useState()
  const [groupCol, setGroupCol] = useState()
  const [features, setFeatures] = useState([])
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleCheckboxChange = (updatedCheckedOptions) => {
    setCheckedOptions(updatedCheckedOptions);
  };

  useEffect(() => {
    if(preparedData) {
      const dataToPlot = preparedData.dataToAnalyze;
      const groupCol = preparedData.outcome;
      setGroupCol(groupCol)
      const features = preparedData.columnMetadata.numeric;
      setFeatures(features)
      const radarData = {} // one key per group
      features.forEach(feature => {
        radarData[feature] = {} 
      }) 
      dataToPlot.forEach((row) => {
        const group = row[groupCol]
        if(group) {
          features.forEach(feature => {
            const entry = radarData[feature];
            if(!entry[group]) {
              entry[group] = []
            }
            const groupData = entry[group];
            row[feature] && groupData.push(row[feature]);
          }) 
        }
      })
      setRadarData(radarData)
    }
  }, [preparedData])

  useEffect(() => {
    if(radarData) {
      console.log(checkedOptions)
      const radarDataMean = Object.keys(radarData).map((feature) => {
        const featureData = radarData[feature]
        const featureMeanData = {
          feature
        }        
        Object.keys(featureData).forEach((groupVal) => {
          featureMeanData[groupVal] = mean(featureData[groupVal]).toFixed(2)
        })
        return featureMeanData
      })
      setRadarDataMean(radarDataMean.filter((row) => checkedOptions.includes(row.feature)))
    }
  }, [radarData, checkedOptions])

  const handleSaveAsImage = () => {
    if (divRef.current) {
      html2canvas(divRef.current).then((canvas) => {
        // Convert the canvas to a data URL
        const dataURL = canvas.toDataURL('image/png');

        // Create a download link
        const link = document.createElement('a');
        link.download = 'my-image.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return (
    <div>
      <CheckboxPanel options={features} onCheckboxChange={handleCheckboxChange} />
      <div ref={divRef} style={{border: '2px solid black', height, width}}> 
      {radarDataMean && radarDataMean.length > 0 && <NivoRadar data={radarDataMean}/>}
      </div>
      <Button variant="outlined" onClick={handleSaveAsImage}>Save as Image</Button>
    </div>
  );
};
