const jwt = require("jsonwebtoken");
const config = require("../config/var");
const {
  app: { jwt_key }
} = config;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwt_key);
    req.userData = {
      username: decodedToken.username,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "You are not authenticated!" });
  }
};
