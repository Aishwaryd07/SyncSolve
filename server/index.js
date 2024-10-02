const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');

// require('dotenv').config();  //not required ig bcz using config file 
const db_config = require('./config/db.config')
const auth_config = require('./config/auth.config')
const authMW = require('./middleware/auth.mw')

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(db_config.DB_url);

const db = mongoose.connection

db.on("error",(err) => {
  console.log("error while connnecting to the database", err);
})

db.once("open", () => {
  console.log("connected to the database..")
})


const secretKey = auth_config.secretKey;


// const Question = mongoose.model('Question', questionSchema);


/* stitch routes to the server */
require("./routes/auth.routes")(app);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
