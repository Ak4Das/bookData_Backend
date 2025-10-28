require("dotenv").config()
const mongoDBUri = process.env.MONGODB

const mongoose = require("mongoose")
async function connectToDatabase() {
  await mongoose
    .connect(mongoDBUri)
    .then(() => {
      console.log("Connected to Database")
    })
    .catch((error) => {
      console.log("Connection Failed", error)
    })
}

module.exports = connectToDatabase