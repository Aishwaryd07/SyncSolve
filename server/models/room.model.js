const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    groupName: {
      type: String,
      required: true
    },
    roomCode: {
      type: String,
      required: true,
      unique: true // Ensures room codes are unique
    }
});

module.exports = mongoose.model("Room", roomSchema); 