const authController = require("../controllers/auth.controller")
const authMW = require("../middleware/auth.mw")

module.exports = (app) => {
    app.post("/register", authController.register);
    app.post("/verify-otp", authController.verifyOtp);
    app.post('/user/login', authController.signIn);
    app.post('/set-password', [authMW.authenticateUserJwt], authController.setPassword);
    app.get('/user', authMW.authenticateUserJwt, authController.getUser);
}
