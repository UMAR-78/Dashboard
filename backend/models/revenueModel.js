
const mongoose = require('mongoose');

// Define the schema for your data
const revenueSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  sheetName: { type: String, required: true },
  columnNames: [String], // Array of column names
  rowData: { type: mongoose.Schema.Types.Mixed }// Adjust this based on the structure of your data
});

// Create the model using the schema
module.exports = mongoose.model("RevenueSchema", revenueSchema);


