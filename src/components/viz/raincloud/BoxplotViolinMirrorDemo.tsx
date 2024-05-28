import { data } from "./data";
import { BoxplotViolinMirror } from "./BoxplotViolinMirror";
import { useState, useRef } from "react";
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 50;

export const BoxplotViolinMirrorDemo = ({ width = 400, height = 400 }) => {
  const [mirrorPosition, setMirrorPosition] = useState(0.6);
  const [smoothing, setSmoothing] = useState(true);
  const divRef = useRef(null);

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
    <div style={{ height, width }} >
      
      <div ref={divRef} style={{border: '2px solid black'}}> 
      <BoxplotViolinMirror
        data={data}
        width={width}
        height={height - HEADER_HEIGHT - FOOTER_HEIGHT}
        mirrorPosition={0.5}
        smoothing={smoothing}
      />
      <div style={{ height: FOOTER_HEIGHT }}>
        <i style={{ color: "grey", fontSize: 14 }}>
          You can use{" "}
          <span
            style={{ color: "purple", cursor: "pointer" }}
            onClick={() => setSmoothing(true)}
          >
            smoothing
          </span>{" "}
          or{" "}
          <span
            style={{ color: "purple", cursor: "pointer" }}
            onClick={() => setSmoothing(false)}
          >
            steps
          </span>
          .
        </i>
      </div>
      </div>
      <Button variant="outlined" onClick={handleSaveAsImage}>Save as Image</Button>
    </div>
  );
};
