const express = require("express");
const cors = require("cors");
const app = express();
const revenueRoutes = require('./routes/revenueRoutes')
const bodyParser = require('body-parser')
const multer = require('multer');
const connectDB = require('./utils/db')

connectDB();

app.use(express.json());
app.use(cors(
  {
    origin : ["https://dashboard-frontends.vercel.app"],
    methods:["POST" , "GET"],
    credentials:true
  }
));



app.use('/' , revenueRoutes)


app.listen(5000, () => {
  console.log("App is listening on the port 5000");
});
