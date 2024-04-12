const express = require("express");
const Router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require('multer');
const uuu = express();

const {uploadRevenueData , getRevenueFiles , getMonthsFromRevenueFiles , getRevenueData}  = require('../controllers/revenueContoller')

Router.post('/upload-revenue-file' ,  uploadRevenueData)
Router.get('/getRevenueFiles' ,  getRevenueFiles)
Router.get('/get-Months-From-RevenueFiles' ,  getMonthsFromRevenueFiles)
Router.get('/getRevenueData/:fileName' ,  getRevenueData)





module.exports =Router ;