const authMW = require("../middleware/auth.mw")
const roomController = require("../controllers/room.controller")

module.exports = (app) => {
    app.post('/create-room', authMW.authenticateUserJwt, roomController.createRoom);
    app.get('/ifRoomExists/:roomCode', authMW.authenticateUserJwt, roomController.ifRoomExists);
    app.get('/get-rooms', authMW.authenticateUserJwt, roomController.getRooms);
} 