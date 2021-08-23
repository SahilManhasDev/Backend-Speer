const dotenv = require("dotenv");

dotenv.config();

const config = {
  app: {
    port: parseInt(process.env.PORT),
    jwt_key: process.env.JWT_SECRET_KEY,
    base_url: process.env.BASE_URL,
    app_url: process.env.APP_URL
  },
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dbUrl: process.env.DB_URL,
  }
};

module.exports = config;
