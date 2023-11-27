import React, { useState } from "react";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";

function str2xml(str) {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  console.log(str)
  return new DOMParser().parseFromString(str, "text/xml");
}

// Get paragraphs as javascript array
function getParagraphs(content) {
  const zip = new PizZip(content);
  const xml = str2xml(zip.files["word/document.xml"].asText());
  console.log(xml)

  const paragraphsXml = xml.getElementsByTagName("w:p");
  const paragraphs = [];

  const xmlns = {
    w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
  };
  const boldTextElements = xml.getElementsByTagNameNS(xmlns.w, "b");

//   console.log(boldTextElements);

  for (let i = 0, len = paragraphsXml.length; i < len; i++) {
    // const boldElements = paragraphsXml[i].getElementsByTagName("w:bold");
    // console.log(paragraphsXml[i])
    let fullText = "";
    const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
    for (let j = 0, len2 = textsXml.length; j < len2; j++) {
      const textXml = textsXml[j];
      if (textXml.childNodes) {
        const val = textXml.childNodes[0].nodeValue;
        if(textXml.previousSibling?.getElementsByTagName("w:b").length > 0) {
          console.log('Found a bold sibling ', textXml.previousSibling?.getElementsByTagName("w:b"))
            fullText += `<span className="bold-text"> ${val} </span>`;
        } else {
            fullText += val;
        }
      }
    }
    if (fullText) {
      paragraphs.push(fullText);
    }
  }
  return paragraphs;
}

const DocxReader = () => {
  const [paragraphs, setParagraphs] = useState([]);

  const onFileUpload = (event) => {
    const reader = new FileReader();
    let file = event.target.files[0];

    reader.onload = (e) => {
      const content = e.target.result;
      const paragraphs = getParagraphs(content);
      setParagraphs(paragraphs);
    };

    reader.onerror = (err) => console.error(err);

    reader.readAsBinaryString(file);
  };

  return (
  <div>
  <input type="file" onChange={onFileUpload} name="docx-reader" />
    {
    paragraphs.map((para, i) => <p key={`p-${i}`}> {`${i+1}. ${para}`} </p>)
    }
  </div>
  );
};

export default DocxReader;