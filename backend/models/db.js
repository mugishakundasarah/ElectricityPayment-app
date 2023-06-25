const mongoose = require('mongoose');

const DB = "epayment-app"
const mongoURL = `mongodb://localhost:27017/${DB}`; // Replace with your MongoDB connection URL

function connectToDB() {
  return mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = connectToDB;
