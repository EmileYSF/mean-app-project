const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;
