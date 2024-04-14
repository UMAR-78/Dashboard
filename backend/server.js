const express = require("express");
const cors = require("cors");
const app = express();
const revenueRoutes = require('./routes/revenueRoutes')
const connectDB = require('./utils/db')
const path = require('path')
connectDB();

app.use(express.json());
app.use(cors());

app.use('/admin/api/v1' , revenueRoutes)

app.use(express.static(path.join(__dirname, '/frontend/dist')))
app.get('*' ,(req , res) =>{
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})



app.listen(5000, () => {
  console.log("App is listening on the port 5000");
});
