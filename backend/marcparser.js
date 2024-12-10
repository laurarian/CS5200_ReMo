const fs = require('fs');
const path = require('path');
const marc4js = require('marc4js');

// Directory containing MARC files
const marcFolder = './MARC';

// Function to process a single MARC file with proper error handling
function parseMARCFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(err);

            const parser = marc4js.parse({ toFormat: 'object' });

            // Capture the error event
            parser.on('error', (error) => {
                console.error(`Error parsing MARC file: ${filePath}`);
                console.error(`Error message: ${error.message}`);
                reject(error);
            });

            parser.write(data);
            parser.end();

            parser.on('data', (records) => {
                resolve(records instanceof Array ? records : [records]);
            });
        });
    });
}

// Process all MARC files in the folder
async function processMARCFolder(folderPath) {
    const allRecords = [];

    // Helper function to recursively process files and folders
    async function processFolder(folder) {
        const items = fs.readdirSync(folder);

        for (const item of items) {
            const itemPath = path.join(folder, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                // If it's a folder, recurse into it
                await processFolder(itemPath);
            } else if (item.endsWith('.mrc')) {
                // If it's a .mrc file, process it
                console.log(`Processing file: ${itemPath}`);
                try {
                    const records = await parseMARCFile(itemPath);
                    allRecords.push(...records);
                    console.log(`Successfully processed: ${itemPath}`);
                } catch (error) {
                    console.error(`Skipping file due to error: ${itemPath}`);
                    console.error(`Error message: ${error.message}`);
                }
            }
        }
    }

    // Start processing from the root folder
    await processFolder(folderPath);

    return allRecords;
}

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

function extractRecordData(record, existingRecords = []) {
    const data = {
        identifiers: [], // Array to store multiple identifiers
        flags: {
            isDuplicate: false,
            hasCollision: false,
            isMissingData: false,
        },
    };

    const issues = [] // To store details of the issues

    // Helper function to extract subfield data by code
    const getSubfieldData = (field, code) =>
        field?._subfields?.find((sub) => sub._code === code)?._data || null;

    // Extract identifiers (020 for ISBN, 035 for AISN, etc.)
    const identifierFields = record._dataFields?.filter(
        (field) => ["020", "035", "022"].includes(field._tag)
    );
    identifierFields?.forEach((field) => {
        const id = getSubfieldData(field, "a");
        if (id) {
            // Normalize identifier (e.g., remove hyphens)
            const normalizedId = id.replace(/-/g, "").toUpperCase();
            data.identifiers.push(normalizedId);
        }
    });

    if (data.identifiers.length === 0) {
        data.flags.isMissingData = true;
        issues.push("Missing identifiers (ISBN/AISN)");
    }

    // Title (245)
    const titleField = record._dataFields?.find((field) => field._tag === "245");
    data.title = getSubfieldData(titleField, "a") || null;
    if (!data.title) {
        data.flags.isMissingData = true;
        issues.push("Missing title");
    }

    // Publisher and Publication Year (264)
    const publisherField = record._dataFields?.find((field) => field._tag === "264");
    data.publisher = getSubfieldData(publisherField, "b") || null;
    if (!data.publisher) {
        data.flags.isMissingData = true;
        issues.push("Missing publisher");
    }
    data.publicationYear = getSubfieldData(publisherField, "c") || null;
    if (!data.publicationYear) {
        data.flags.isMissingData = true;
        issues.push("Missing publication year");
    }

    // Language (041)
    const languageField = record._dataFields?.find((field) => field._tag === "041");
    data.language = getSubfieldData(languageField, "a") || null;
    if (!data.language) {
        data.flags.isMissingData = true;
        issues.push("Missing language");
    }

    // Edition (250)
    const editionField = record._dataFields?.find((field) => field._tag === "250");
    data.edition = getSubfieldData(editionField, "a") || null;
    if (!data.edition) {
        data.flags.isMissingData = true;
        issues.push("Missing edition");
    }

    // Electronic Resource URL (856)
    const resourceField = record._dataFields?.find((field) => field._tag === "856");
    data.electronicResource = getSubfieldData(resourceField, "u") || null;
    if (!data.electronicResource) {
        data.flags.isMissingData = true;
        issues.push("Missing electronic resource URL");
    }

    // Library Call Number (852)
    const callNumberField = record._dataFields?.find((field) => field._tag === "852");
    data.callNumber = getSubfieldData(callNumberField, "h") || "Unknown Call Number";
    data.callNumberPrefix = getSubfieldData(callNumberField, "k") || null;
    if (!data.callNumber) {
        data.flags.isMissingData = true;
        issues.push("Missing call number");
    }

    // Record Metadata from _controlFields
    const controlFields = Object.fromEntries(
        (record._controlFields || []).map((field) => [field._tag, field._data])
    );
    data.recordControlNumber = controlFields["001"] || null; // Unique record identifier
    data.recordTimestamp = controlFields["005"] || null; // Last modification timestamp
    data.fixedData = controlFields["008"] || null; // Encoded bibliographic information

    // Duplication Check
    if (
        existingRecords?.some((rec) =>
            rec.identifiers.some((id) => data.identifiers.includes(id))
        )
    ) {
        data.flags.isDuplicate = true;
        issues.push(
            `Duplicate record found with identifiers: ${data.identifiers.join(", ")}`
        );
    }

    // Collision Check
    const conflictingRecord = existingRecords?.find((rec) =>
        rec.identifiers.some((id) => data.identifiers.includes(id))
    );
    if (conflictingRecord && conflictingRecord.title !== data.title) {
        data.flags.hasCollision = true;
        issues.push(
            `Collision detected: Identifiers ${data.identifiers.join(
                ", "
            )} have conflicting titles. Existing: "${conflictingRecord.title}", New: "${data.title}"`
        );
    }

    return { data, issues };
}




async function processMARCRecords(folderPath) {
    const existingRecords = []; // Initialize as an empty array to store processed records
    const issueLog = []; // To log flagged issues

    const records = await processMARCFolder(folderPath); // Parse MARC files into records
    for (const record of records) {
        // Ensure existingRecords is an array and pass it to extractRecordData
        const { data: extractedData, issues } = extractRecordData(record, existingRecords);

        // Log issues if any flags are raised
        if (
            extractedData.flags.isDuplicate ||
            extractedData.flags.hasCollision ||
            extractedData.flags.isMissingData
        ) {
            issueLog.push({
                record: extractedData.identifiers,
                issues: issues,
            });
        }

        // Add non-duplicate records to the database
        if (!extractedData.flags.isDuplicate) {
            existingRecords.push(extractedData); // Add only valid records
        }
    }

    console.log(`Total records processed: ${records.length}`);
    console.log(`Issues detected: ${issueLog.length}`);

    // Save issues to a log file for later review
    saveToJSON(issueLog, './issues/marcIssuesLog.json');


    return existingRecords; // Return valid records for further processing
}




// Usage
(async () => {
    try {
        const allRecords = await processMARCRecords(marcFolder);
        console.log(allRecords);
        // Normalize and insert into database if required
        console.log(`Total records parsed: ${allRecords.length}`);

        // Save to a JSON file for inspection or further processing
        saveToJSON(allRecords, './data/marc.json');
    } catch (error) {
        console.error('Error processing MARC folder:', error.message);
    }
})();
