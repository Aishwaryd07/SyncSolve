const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    roomCode : {
        required : true,
        type : String
    },
    sender : {
        type : String, 
        required : true
    },
    message : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Message', messageSchema);