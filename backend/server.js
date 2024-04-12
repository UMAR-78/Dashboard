const express = require("express");
const cors = require("cors");
const app = express();
const revenueRoutes = require('./routes/revenueRoutes')
const bodyParser = require('body-parser')
const multer = require('multer');
const connectDB = require('./utils/db')
const path = require('path')
connectDB();

app.use(express.json());
app.use(cors(
  // {
  //   origin : ["https://dashboard-frontends.vercel.app"],
  //   methods:["POST" , "GET"],
  //   credentials:true
  // }
));



app.use('/' , revenueRoutes)

app.get("/" , (req, res) =>{
  app.use(express.static(path.resolve(__dirname,"frontend" , "dist")));
  res.sendFile(path.resolve(__dirname,"frontend"  , "dist" , "index.html"));
})


app.listen(5000, () => {
  console.log("App is listening on the port 5000");
});
