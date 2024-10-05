const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    otp: {
      type: String,
    },
    password: {
      type: String,
    },
    roomCodes: {
      type: [{
        roomCode: {
          type: String,
        },
        groupName: {
          type: String,
        }
      }],
      default: []
    }
});


module.exports = mongoose.model("User", userSchema);
  