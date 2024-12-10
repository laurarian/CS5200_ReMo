const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Save parsed JSON data to a file
function saveToJSON(records, outputFilePath) {
  // Ensure the directory exists
  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
  }

  // Write JSON data to the file
  fs.writeFileSync(outputFilePath, JSON.stringify(records, null, 2), 'utf-8');
  console.log(`Saved JSON data to ${outputFilePath}`);
}

// Function to parse XLSX and store JSON data
function parseXLSX(filePath, outputDir) {
  // Load the workbook
  const workbook = xlsx.readFile(filePath);

  // Choose the first sheet in the workbook
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet data to JSON
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  console.log(`Parsed data from: ${filePath}`);
  console.log(jsonData);

  // Define output JSON file path
  const fileName = path.basename(filePath, path.extname(filePath)) + '.json';
  const outputFilePath = path.join(outputDir, fileName);

  // Save JSON data to the output directory
  saveToJSON(jsonData, outputFilePath);
  console.log(`JSON data saved to: ${outputFilePath}`);

  return jsonData; // Return the parsed data for further processing if needed
}

// Usage: Define input files and output directory
const inputFiles = ['./CSV-Excel/CRWReportJob148737.xlsx', './CSV-Excel/LibraryTitleCopyReportJob148738.xlsx'];
const outputDir = './data';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function processRecords(data1, data2) {
  const results = [];
  const issueLog = [];

  // Helper functions
  const normalize = (str) => (str || "").trim().toLowerCase();

  // Step 1: Group `data1` records by a unique key (Title + Publisher + Material Type)
  const groupedData1 = {};
  data1.forEach((record) => {
    const uniqueKey = `${normalize(record["Title/Subtitle"])}|${normalize(record.Publisher)}|${normalize(record["Material Type"])}`;

    if (!groupedData1[uniqueKey]) {
      groupedData1[uniqueKey] = {
        ...record,
        Subjects: new Set(),
      };
    }

    // Add subject to the grouped record
    if (record.Subject) {
      groupedData1[uniqueKey].Subjects.add(record.Subject);
    }
  });

  // Convert Subjects Set to an Array
  Object.values(groupedData1).forEach((record) => {
    record.Subjects = Array.from(record.Subjects);
  });

  // Step 2: Build a hash map for supplementary data from `data2`
  const supplementaryMap = {};
  data2.forEach((record) => {
    const uniqueKey = `${normalize(record.Title)}|${normalize(record.Publisher)}|${normalize(record["Material Type"])}`;
    if (uniqueKey) {
      supplementaryMap[uniqueKey] = record;
    }
  });

  // Step 3: Process each grouped record in data1
  Object.values(groupedData1).forEach((groupedRecord) => {
    const uniqueKey = `${normalize(groupedRecord["Title/Subtitle"])}|${normalize(groupedRecord.Publisher)}|${normalize(groupedRecord["Material Type"])}`;
    const matchingRecord = supplementaryMap[uniqueKey];

    // Merge data1 grouped record with data2 supplementary record
    const mergedRecord = {
      title: groupedRecord["Title/Subtitle"],
      materialType: groupedRecord["Material Type"],
      author: groupedRecord["Author"] || matchingRecord?.["Author"] || null,
      isbn: groupedRecord["ISBN"] || matchingRecord?.["Standard Number"] || null,
      publisher: groupedRecord.Publisher,
      publicationYear: groupedRecord["Publication Year"],
      lccn: matchingRecord?.["LCCN"] || null,
      subjects: groupedRecord.Subjects,
      copies: {
        total: parseInt(matchingRecord?.["Total Copies"] || "0", 10),
        available: parseInt(matchingRecord?.["Copies Available"] || "0", 10),
        checkedOut: parseInt(matchingRecord?.["Copies Checked Out"] || "0", 10),
        lost: parseInt(matchingRecord?.["Copies Lost"] || "0", 10),
      },
    };

    // Step 4: Check for Missing Data
    const issues = [];
    if (!mergedRecord.isbn) {
      issues.push("Missing ISBN");
    }
    if (!mergedRecord.publisher) {
      issues.push("Missing Publisher");
    }
    if (!mergedRecord.publicationYear) {
      issues.push("Missing Publication Year");
    }
    if (!mergedRecord.lccn) {
      issues.push("Missing LCCN");
    }
    if (!mergedRecord.subjects || mergedRecord.subjects.length === 0) {
      issues.push("Missing Subjects");
    }
    if (mergedRecord.copies.total === 0) {
      issues.push("Missing Copies Data");
    }
    if (!mergedRecord.title) {
      issues.push("Missing Title");
    }
    if (!mergedRecord.materialType) {
      issues.push("Missing Material Type");
    }
    if (!mergedRecord.author) {
      issues.push("Missing Author");
    }

    // Add issues to the log
    if (issues.length > 0) {
      issueLog.push({
        title: mergedRecord.title,
        materialType: mergedRecord.materialType,
        publisher: mergedRecord.publisher,
        issues,
      });
    }

    // Add clean merged record to results
    results.push(mergedRecord);
  });

  return { results, issueLog };
}

function saveMergeResults(results, outputPath) {
  saveToJSON(results, outputPath);
  console.log(`Merged records saved to: ${outputPath}`);
}

// Function to save issues to a file
function saveIssuesLog(issueLog, outputPath) {
  saveToJSON(issueLog, outputPath);
  console.log(`Issues log saved to: ${outputPath}`);
}



// Example Usage
const data1 = parseXLSX(inputFiles[0], outputDir);
const data2 = parseXLSX(inputFiles[1], outputDir);

const { results, issueLog } = processRecords(data1, data2);
console.log("Merged Records:", results);
console.log("Issues:", issueLog);

// Save merged records to a file
saveMergeResults(results, './data/mergedCSV.json');


// Save issues to a file
saveIssuesLog(issueLog, './issues/csvIssuesLog.json');