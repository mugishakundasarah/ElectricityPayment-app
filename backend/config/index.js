const cors = require('cors')
const express = require('express')
const app = require("express")();
const dotenv = require("dotenv")

const routes = require("../routes/index")
const connectToDB = require("../models/db"); 

const loadDb = () => {
    connectToDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
}




module.exports = function loadApp(){
    dotenv.config()
    loadDb()
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", routes)
}

