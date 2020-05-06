const express = require("express");
const multer = require("multer");

const objectId = require("mongodb").ObjectID;
const dbUtil = require("../dbUtil");
const auth = require("../auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if (!isValid) {
      error = new Error("Invalid mime type");
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

var db;

router.use((req, res, next) => {
  db = dbUtil.getDb();
  next();
});

router.post(
  "",
  auth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const userId = new objectId(req.userTokenData.userId);
    const product = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      imagePath: url + "/images/" + req.file.filename,
      user_id: userId,
    };

    db.collection("products")
      .insertOne(product)
      .then((createdProduct) => {
        res.status(201).json({
          message: "Product added successfully",
          product: {
            ...createdProduct,
            id: createdProduct._id,
          },
        });
      });
  }
);

router.put(
  "/:id",
  auth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const id = new objectId(req.params.id);
    const userId = new objectId(req.userTokenData.userId);
    const product = {
      _id: id,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      imagePath: imagePath,
      userId: req.userTokenData.userId
    };
    db.collection("products")
      .updateOne({ _id: id, user_id: userId }, { $set: product })
      .then((updatedProduct) => {
        if (updatedProduct.result.n > 0) {
          res.status(200).json({
            message: "Product updated successfully",
          });
        } else {
          res.status(401).json({
            message: "Not authorized"
          });
        }
      });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productsQuery = db.collection("products").find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    productsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productsQuery
    .toArray()
    .then((products) => {
      fetchedProducts = products;
      return productsQuery.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Products fetched successfully",
        products: fetchedProducts,
        maxProducts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  const id = new objectId(req.params.id);
  db.collection("products")
    .findOne({ _id: id })
    .then((product) => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    });
});

router.delete("/:id", auth, (req, res, next) => {
  const id = new objectId(req.params.id);
    const userId = new objectId(req.userTokenData.userId);
    db.collection("products")
    .deleteOne({ _id: id, user_id: userId })
    .then((result) => {
      if (result.deletedCount) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    });
});

module.exports = router;
