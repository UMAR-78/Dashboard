const express = require('express');
const router = express.Router();
const revenueModel = require('../models/revenueModel');

// POST endpoint to handle uploading Excel data
const uploadRevenueData = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { fileName, sheetName, columnNames, data } = req.body;

    console.log("FILE NAME", fileName);
    console.log("Sheet name", sheetName);
    console.log("column", columnNames);
    console.log("rows", data);
    
    // Check if a document with the same fileName already exists
    const existingFile = await revenueModel.findOne({ fileName: fileName });

    if (existingFile) {
      console.log('Found existing file:', existingFile);
      // Delete existing data associated with the file
      const deletionResult = await revenueModel.deleteMany({ fileName: fileName });
      console.log('Deletion result:', deletionResult);
      console.log('Existing data deleted for file:', fileName);
    } else {
      console.log('No existing file found with name:', fileName);
    }

    // Save column names to the database
    await revenueModel.create({
      fileName: fileName,
      sheetName: sheetName,
      columnNames: columnNames
    });

    // Save the data rows to the database
    for (const row of data) {
      await revenueModel.create({
        fileName: fileName,
        sheetName: sheetName,
        rowData: row
      });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error uploading data:', error);
    res.status(500).json({ error: 'Failed to upload data to the database' });
  }
};


// Endpoint to fetch all revenue files
const getRevenueFiles =  async (req, res) => {
  try {
    const files = await revenueModel.distinct('fileName');
    console.log(files);
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
}


// Endpoint to fetch data from revenue files
const getRevenueData = async (req, res) => {
  try {
    // Extract the selected file name from the request parameters
    const { fileName } = req.params;

    // Find all rows from MongoDB that match the selected file name
    const rows = await revenueModel.find({ fileName });

    // Send the rows as a response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};




// Endpoint to fetch all months from revenue Files
const getMonthsFromRevenueFiles =  async (req, res) => {
  try {
    const months = await revenueModel.distinct('month');
    res.json(months);
  } catch (error) {
    console.error('Error fetching months:', error);
    res.status(500).json({ error: 'Failed to fetch months' });
  }
};




module.exports = { uploadRevenueData , getRevenueFiles, getMonthsFromRevenueFiles ,getRevenueData };
