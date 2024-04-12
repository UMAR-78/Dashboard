const express = require("express");
const cors = require("cors");
const app = express();
const revenueRoutes = require('./routes/revenueRoutes')
const bodyParser = require('body-parser')
const multer = require('multer');
const connectDB = require('./utils/db')

connectDB();

app.use(express.json());
app.use(cors());



app.use('/admin/api/v1' , revenueRoutes)


app.listen(5000, () => {
  console.log("App is listening on the port 5000");
});
