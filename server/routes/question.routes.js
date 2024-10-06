const authMW = require("../middleware/auth.mw");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const questionController = require("../controllers/question.controller")

module.exports = (app) => {
    app.post('/addQuestion/:roomCode', authMW.authenticateUserJwt, upload.single('imageSolution'), questionController.addQuestion);
    app.get('/getAllQuestions/:roomCode', questionController.getAllQuestions);
    app.get('/getAllDates/:roomCode', authMW.authenticateUserJwt, questionController.getAllDates);
    app.delete('/deleteQuestion/:questionId', authMW.authenticateUserJwt, questionController.deleteQuestion);
}