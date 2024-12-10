const fs = require('fs');
const { MongoClient } = require('mongodb');

async function loadJSONIntoMongoDB() {
  const uri = 'mongodb+srv://5200Database:5200database@5200database.5wict.mongodb.net/?retryWrites=true&w=majority&appName=5200database'; // MongoDB connection URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Access database
    const db = client.db('Library');

    // Load and insert CSV JSON data
    const csvData = JSON.parse(fs.readFileSync('./data/mergedCSV.json', 'utf-8'));
    const csvCollection = db.collection('books_csv');
    await csvCollection.insertMany(csvData);
    console.log('CSV data inserted into books_csv collection');

    // Load and insert ONIX JSON data
    const onixData = JSON.parse(fs.readFileSync('./data/mergedONIX.json', 'utf-8'));
    const onixCollection = db.collection('books_onix');
    await onixCollection.insertMany(onixData);
    console.log('ONIX data inserted into books_onix collection');

    // Load and insert MARC JSON data
    const marcData = JSON.parse(fs.readFileSync('./data/marc.json', 'utf-8'));
    const marcCollection = db.collection('books_marc');
    await marcCollection.insertMany(marcData);
    console.log('MARC data inserted into books_marc collection');

    // Load and insert csv issues log JSON data
    const csvIssuesData = JSON.parse(fs.readFileSync('./issues/csvIssuesLog.json', 'utf-8'));
    const csvIssuesCollection = db.collection('csvIssuesLog');
    await csvIssuesCollection.insertMany(csvIssuesData);
    console.log('CSV issues log inserted into csvIssuesLog collection');

    // Load and insert onix issues log JSON data
    const onixIssuesData = JSON.parse(fs.readFileSync('./issues/onixIssuesLog.json', 'utf-8'));
    const onixIssuesCollection = db.collection('onixIssuesLog');
    await onixIssuesCollection.insertMany(onixIssuesData);
    console.log('ONIX issues log inserted into onixIssuesLog collection');

    // Load and insert marc issues log JSON data
    const marcIssuesData = JSON.parse(fs.readFileSync('./issues/marcIssuesLog.json', 'utf-8'));
    const marcIssuesCollection = db.collection('marcIssuesLog');
    await marcIssuesCollection.insertMany(marcIssuesData);
    console.log('MARC issues log inserted into marcIssuesLog collection');

  } catch (error) {
    console.error('Error inserting data into MongoDB:', error.message);
  } finally {
    // Close MongoDB connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

loadJSONIntoMongoDB();
