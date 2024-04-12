const mongoose = require("mongoose");

const connectDB = async () => {
  
  mongoose.set("strictQuery", true);

  mongoose.connect("mongodb+srv://umarjamiljamil31:HXxzA3s9jOAMOUsM@umarcluster.3ez2vjw.mongodb.net/", {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.log("Failed to connect with db");
  });

  db.once("open", () => {
    console.log("Connected with db");
  });
};

module.exports = connectDB;
