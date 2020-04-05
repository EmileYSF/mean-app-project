const express = require("express");
const objectId = require('mongodb').ObjectID;

const router = express.Router();

const dbUtil =  require('../dbUtil');

var db;

router.use((req, res, next) => {
  db = dbUtil.getDb();
  next();
});

router.post("", (req, res, next) => {
  const product = req.body;
  db.collection("products").insertOne({ title: product.title, description: product.description })
  .then (doc => {
    res.status(201).json({
      id : doc.insertedId
    });
  });
});

router.put("/:id", (req, res, next) => {
  const id = new objectId(req.params.id);
  const product = {
    title: req.body.title,
    description: req.body.description
  }
  db.collection("products").findOneAndReplace( {_id: id }, product).then(result => {
    res.status(200).json({
      message: "Product updated successfully"
    });
  })
});

router.get("", (req, res, next) => {
  db.collection("products").find({ }).toArray().then(doc => {
    products = doc;
    res.status(200).json({
      products: products
    });
  });
});

router.get("/:id", (req, res, next) => {
  const id = new objectId(req.params.id);
  db.collection("products").findOne({ _id: id }).then(doc => {
    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: "Product not found"
      });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  const id = new objectId(req.params.id);
  db.collection("products").deleteOne({ _id: id }).then(result => {
    res.status(200).json({ message: "Product deleted !" });
  })
});

module.exports = router;
