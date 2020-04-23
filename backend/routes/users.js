const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const objectId = require("mongodb").ObjectID;
const dbUtil = require("../dbUtil");

const router = express.Router();

const jwt_secret = "secret_key_that_should_be_soooo_long";
var db;

router.use((req, res, next) => {
  db = dbUtil.getDb();
  next();
});

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    const user = {
      email: req.body.email,
      password: hashedPassword,
    };
    db.collection("users")
      .insertOne(user)
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "User already exist, please try another e-mail",
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  var fetchedUser;
  db.collection("users")
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return (() => {
          res.status(401).json({
            message: "Authentification failed",
          });
        }).catch((err) => console.log(err));
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Wrong password. Try again",
        });
      }
      const token = jwt.sign(
        { id: fetchedUser._id, email: fetchedUser.email },
        jwt_secret,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "User doesn't exist, please try another e-mail or reset your password",
      });
    });
});

module.exports = router;
