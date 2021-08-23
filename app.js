const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/var");
const cors = require("cors");
const {
  db: { host, username, password, name },
} = config;
const bodyParser = require("body-parser");
const routes = require("./routes/index");
global.__basedir = __dirname;
const app = express();
mongoose
  .connect(`mongodb+srv://${username}:${password}@${host}/${name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api", routes);
app.use('/images', express.static('public/images'));

module.exports = app;
