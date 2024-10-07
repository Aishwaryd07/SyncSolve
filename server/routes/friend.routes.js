const friendController = require("../controllers/friend.controller");
const authMW = require("../middleware/auth.mw");

module.exports = (app) => {
    app.get('/getAllFriends/:roomCode', friendController.getAllFriends);
    app.get('/friends/getDates/:roomCode/:userId?' ,authMW.authenticateUserJwt, friendController.getFriendDates);
    app.get('/friend/getAllQuestions/:roomCode', authMW.authenticateUserJwt, friendController.getAllQuestions);
}