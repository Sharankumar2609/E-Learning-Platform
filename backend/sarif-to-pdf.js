// convert-sarif-to-pdf.js
import fs from "fs";
import { jsPDF } from "jspdf";

// Read SARIF file
const sarifFile = "./backend/codeql-results.sarif";
if (!fs.existsSync(sarifFile)) {
  console.error("SARIF file not found:", sarifFile);
  process.exit(1);
}

const sarif = JSON.parse(fs.readFileSync(sarifFile, "utf8"));
const doc = new jsPDF();
let y = 20;

doc.setFontSize(16);
doc.text("CodeQL Scan Report", 10, 10);

sarif.runs.forEach(run => {
  if (!run.results || run.results.length === 0) {
    doc.text("No issues found.", 10, y);
    y += 10;
    return;
  }

  run.results.forEach((result, i) => {
    const ruleId = result.ruleId || "N/A";
    const message = result.message?.text || "No description provided.";
    const location =
      result.locations?.[0]?.physicalLocation?.artifactLocation?.uri || "Unknown file";

    // Print alert summary
    doc.setFontSize(12);
    doc.text(`${i + 1}. Rule: ${ruleId}`, 10, y);
    y += 7;
    doc.text(`File: ${location}`, 10, y);
    y += 7;
    doc.text(`Message: ${message}`, 10, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
});

doc.save("CodeQL_Report.pdf");
console.log("✅ CodeQL_Report.pdf generated successfully.");
