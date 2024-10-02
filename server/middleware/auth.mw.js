const jwt = require("jsonwebtoken");
const auth_config = require("../config/auth.config")



const authenticateUserJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, auth_config.secretKey, (err, user) => {
        if (err) {
          console.log(err);
          return res.sendStatus(403);
        }
        req.user = user;
        console.log(user);
        next();
      });
    } else {
      res.sendStatus(401);
    }
};

module.exports = {
    authenticateUserJwt : authenticateUserJwt
}