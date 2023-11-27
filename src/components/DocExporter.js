// DocxExporter.js
import { Document, Packer, TextRun } from 'docx';
import { saveAs } from "file-saver";

export function exportToDocx(stats) {
  const doc = new Document();
  doc.addSection({
    properties: {},
    children: [
      new TextRun("Descriptive Statistics").heading1(),
      new TextRun("Column Name"),
      new TextRun("Mean"),
      new TextRun("Median"),
      new TextRun("Variance"),
      new TextRun("Standard Deviation"),
      ...stats.map((stat) => [
        new TextRun(stat.columnName),
        new TextRun(stat.mean),
        new TextRun(stat.median),
        new TextRun(stat.variance),
        new TextRun(stat.stdDev),
      ]),
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    // Save or export the buffer as a DOCX file.
  });
}


export function exportManuscript(stats) {
  console.log(stats)
  const statRuns = stats.map((stat) => [
    new TextRun(stat.columnName),
    new TextRun(stat.mean),
    new TextRun(stat.median),
    new TextRun(stat.variance),
    new TextRun(stat.stdDev),
  ]);
  console.log(statRuns);
  const doc = new Document({sections : [
    {
      // properties: {},
    children: [
      new TextRun({
        text: "Descriptive Statistics",
        bold: true,
    }),
      new TextRun("Column Name"),
      new TextRun("Mean"),
      new TextRun("Median"),
      new TextRun("Variance"),
      new TextRun("Standard Deviation"),
    ],
  }]});
  // doc.addSection();

  Packer.toBuffer(doc).then((buffer) => {
    console.log(buffer);
    saveAs(buffer, "example.docx");
    console.log("Document created successfully");
 });
}
