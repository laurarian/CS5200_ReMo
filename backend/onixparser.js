import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, basename, extname, join } from 'path';
import { Parser } from 'xml2js';

// Save parsed JSON data to a file
function saveToJSON(records, outputFilePath) {
    // Ensure the directory exists
    const dir = dirname(outputFilePath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }

    // Write JSON data to the file
    writeFileSync(outputFilePath, JSON.stringify(records, null, 2), 'utf-8');
    console.log(`Saved JSON data to ${outputFilePath}`);
}

// Function to convert ONIX XML to JSON
async function convertONIXToJSON(xmlFilePath, outputDir) {
    try {
        // Read the XML file
        const xmlData = readFileSync(xmlFilePath, 'utf-8');

        // Parse XML to JSON
        const parser = new Parser({ explicitArray: false, mergeAttrs: true });
        const jsonData = await parser.parseStringPromise(xmlData);

        // Create output JSON file path
        const fileName = basename(xmlFilePath, extname(xmlFilePath)) + '.json';
        const outputFilePath = join(outputDir, fileName);

        // Write JSON data to file
        saveToJSON(jsonData, outputFilePath);
        console.log(`Converted ${xmlFilePath} to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error converting ${xmlFilePath} to JSON:`, error.message);
    }
}

// Usage
const inputFiles = [
    './ONIX/LEEANDLOW_20210707.xml',
    './ONIX/Lerner_Print_ONIX_20240104104306.xml',
];
const outputDir = './data';

// Ensure the output directory exists
if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
}

// Convert each ONIX file to JSON
await convertONIXToJSON(inputFiles[0], outputDir);
await convertONIXToJSON(inputFiles[1], outputDir);

console.log('ONIX XML to JSON conversion completed');

// Helper function to normalize a string
const normalize = (str) => (str || "").trim().toLowerCase();

// Helper function to extract key fields
function extractProductData(product, source) {
    const identifiers = product.productidentifier || product.ProductIdentifier || [];
    const isbn = identifiers.find((id) => id.b221 === "15" || id.ProductIDType === "15")?.b244 ||
        identifiers.find((id) => id.ProductIDType === "15")?.IDValue || null;
    const title =
        product.descriptivedetail?.titledetail?.titleelement?.b203 ||
        product.DescriptiveDetail?.TitleDetail?.TitleElement?.TitleText ||
        null;
    const author = Array.isArray(product.descriptivedetail?.contributor)
        ? product.descriptivedetail.contributor.map((con) => con.b036).join(", ")
        : product.DescriptiveDetail?.Contributor?.PersonName || null;
    const publisher =
        product.publishingdetail?.publisher?.b081 ||
        product.PublishingDetail?.Publisher?.PublisherName ||
        null;
    const price =
        product.productsupply?.supplydetail?.price?.j151 ||
        product.ProductSupply?.SupplyDetail?.Price?.PriceAmount ||
        null;
    const subjects = Array.isArray(product.descriptivedetail?.subject || product.DescriptiveDetail?.Subject)
        ? (product.descriptivedetail?.subject || product.DescriptiveDetail?.Subject)
            .map((sub) => sub.b070 || sub.SubjectHeadingText || sub.SubjectCode)
            .filter(Boolean)
        : [];
    const publicationDate =
        product.publishingdetail?.publishingdate?.b306?._ ||
        product.PublishingDetail?.PublishingDate?.Date ||
        null;

    return {
        isbn,
        title,
        author,
        publisher,
        price,
        subjects,
        publicationDate,
        source,
    };
}


// Optimized merge function using a hash map
function mergeONIXData(onix1, onix2) {
    const productMap = new Map();
    const issueLog = [];

    // Function to add or update a product in the map
    const addOrUpdateProduct = (productData) => {
        const key = productData.isbn || normalize(productData.title);

        if (productMap.has(key)) {
            const existing = productMap.get(key);
            const issues = [];

            // Detect collisions
            if (existing.author !== productData.author) {
                issues.push(`Author conflict: '${existing.author}' vs '${productData.author}'`);
            }
            if (existing.publisher !== productData.publisher) {
                issues.push(`Publisher conflict: '${existing.publisher}' vs '${productData.publisher}'`);
            }
            if (existing.price !== productData.price) {
                issues.push(`Price conflict: '${existing.price}' vs '${productData.price}'`);
            }

            // Log issues
            if (issues.length > 0) {
                issueLog.push({
                    title: productData.title,
                    isbn: productData.isbn,
                    issues,
                    sources: [existing.source, productData.source],
                });
            }

            // Merge missing data
            existing.author = existing.author || productData.author;
            existing.publisher = existing.publisher || productData.publisher;
            existing.price = existing.price || productData.price;
            existing.publicationDate = existing.publicationDate || productData.publicationDate;
            existing.subjects = [...new Set([...existing.subjects, ...productData.subjects])];
        } else {
            productMap.set(key, productData);
        }
    };

    // Process products from both datasets
    const processONIXData = (products, source) => {
        products.forEach((product) => {
            const data = extractProductData(product, source);

            // Log missing fields
            const missingFields = [];
            if (!data.isbn) missingFields.push('ISBN');
            if (!data.title) missingFields.push('Title');
            if (!data.author) missingFields.push('Author');

            if (missingFields.length > 0) {
                issueLog.push({
                    title: data.title || 'Unknown Title',
                    isbn: data.isbn || 'Unknown ISBN',
                    issues: [`Missing fields: ${missingFields.join(', ')}`],
                    source,
                });
            }

            addOrUpdateProduct(data);
        });
    };

    // Process ONIX1 and ONIX2
    processONIXData(onix1?.ONIXMessage?.Product || [], "LEEANDLOW");
    processONIXData(onix2?.ONIXmessage?.product || [], "LERNER");

    return { allProducts: Array.from(productMap.values()), issueLog };
}


// Example Usage
const onix1 = JSON.parse(readFileSync('./data/LEEANDLOW_20210707.json', 'utf-8'));
const onix2 = JSON.parse(readFileSync('./data/Lerner_Print_ONIX_20240104104306.json', 'utf-8'));

const { allProducts, issueLog } = mergeONIXData(onix1, onix2);

// Save merged data and issue log
saveToJSON(allProducts, './data/mergedONIX.json');
saveToJSON(issueLog, './issues/onixIssuesLog.json');

console.log(`Merged ${allProducts.length} products. Issues logged: ${issueLog.length}`);

