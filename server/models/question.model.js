const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [],
    imageSolution: {
      fieldname: String,
      originalname: String,
      encoding: String,
      mimetype: String,
      buffer: Buffer,
      size: Number,
    },
    date: {
      type: Date,
      default: () => Date(),
    },
    roomCode :{
      type : String,
      required : true,
    }
});

module.exports = mongoose.model("Question", questionSchema);